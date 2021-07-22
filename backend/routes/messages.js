"use strict"

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')

const auth = require('../middleware/auth.js')

const router = express.Router();




// get all conversation starters

router.get('/:userid', auth(1),

    async (req,res)=>  
    {
        const {userid} = req.params

        let messageCount = 
            k('messages').count('id')
            .where(
                'replay_to',  
                k.ref('msgid')
            ).as('message_count')

        let unreadCount = 
            k('messages').count('id')
            .where(
                'replay_to',  
                k.ref('msgid')
            ).andWhere(
                'read',
                0
            ).as('unread_count')


        let result = await
            k('messages').select(
                'messages.*',

                'messages.id as msgid',

                'sender.username as sender_name', 
                'sender.level as sender_level',

                'recipient.username as recipient_name', 
                'recipient.level as recipient_level',

                messageCount,
                unreadCount

            ).leftJoin(
                {sender: 'users'},
                'messages.sender_id','=', 'sender.id'
            ).leftJoin(
                {recipient: 'users'},
                'messages.recipient_id','=', 'recipient.id'
            ).where(
                t=> t.where(
                    'sender_id', 
                    userid
                    ).orWhere(
                    'recipient_id', 
                    userid)
            ).andWhere(
                t=>t.whereNull('replay_to'))
        
        let result2 = await k('messages').count('id', {'as' : 'unread'})
            .where(
                'recipient_id',  
                userid
            ).andWhere(
                'read',
                0
            )

        res.append('-unread-count', result2[0]['unread'])
        res.send(result)

    }
)

// get one conversation
router.get('/:userid/:convoid', auth(1),

    async (req,res)=>
    {
        const {userid, convoid} = req.params

        let conversation_starter = await
            k('messages').select(
                'messages.*',

                'sender.username as sender_name', 
                'sender.level as sender_level',

                'recipient.username as recipient_name', 
                'recipient.level as recipient_level',
                        
            ).leftJoin(
                {sender: 'users'},
                'messages.sender_id','=', 'sender.id'
            ).leftJoin(
                {recipient: 'users'},
                'messages.recipient_id','=', 'recipient.id'
            ).where('messages.id', convoid)

        let messages = await
            k('messages').select(
                'messages.*',

                'sender.username as sender_name', 
                'sender.level as sender_level',

                'recipient.username as recipient_name', 
                'recipient.level as recipient_level',
            ).leftJoin(
                {sender: 'users'},
                'messages.sender_id','=', 'sender.id'
            ).leftJoin(
                {recipient: 'users'},
                'messages.recipient_id','=', 'recipient.id'
            ).where('messages.replay_to', convoid).orderBy('created_on')
        
        res.send({
            conversation: conversation_starter[0],
            messages: messages
        })

    }
)

router.post('/', auth(1),
    V.body({
        'title': V.string().required(),
        'message_body': V.string().required(),
        'replay_to' : V.string(),
        'sender_id' : V.number().required(),
        'recipient_id' : V.number().required()
    }),
    async (req,res)=>
    {

        let result = await
            k('messages').insert({...req.body})
        
        res.send(result)
    }
)

router.patch('/', auth(1),
    V.query({'read': V.number().round()}),
    async (req,res) =>
    {
        console.log("UPDATING "+ req.query.read)
        let result =  await k('messages').update({'read':1}).where('id', req.query.read)
        let result2 = await k('messages').update({'read':1}).where('replay_to', req.query.read)

        res.send([1])
    }
)

module.exports = router