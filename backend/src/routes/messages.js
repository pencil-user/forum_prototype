"use strict"

const express = require('express')
const V = require('../validator/validator.js')
const messageService = require('../services/messageService.js')
const auth = require('../middleware/auth.js')
const router = express.Router();

const CONSTS = require('../consts.js')

const USER_LEVEL = CONSTS.USER.LEVEL

// get all conversation starters

router.get('/:userid', auth(USER_LEVEL.USER),

    async (req, res) => {
        const { userid } = req.params

        let result = await messageService.getAllConversationStarters(userid)

        let result2 = await messageService.countUnreadMessagesByUser(userid)

        res.append('-unread-count', result2)
        res.status(200).send(result)

    }
)

// get one conversation
router.get('/:userid/:convoid', auth(USER_LEVEL.USER),

    async (req, res) => {
        const { convoid } = req.params

        let result = await messageService.getOneConversation(convoid)

        res.status(200).send(result)

    }
)

router.post('/', auth(USER_LEVEL.USER),
    V.body({
        'title': V.string().required(),
        'message_body': V.string().required(),
        'replay_to': V.string(),
        'sender_id': V.number().required(),
        'recipient_id': V.number().required()
    }),
    async (req, res) => {

        let result = await
            messageService.insertMessage(req.body)

        res.status(200).send(result)
    }
)

router.patch('/', auth(USER_LEVEL.USER),
    V.query({ 'read': V.number().round() }),
    async (req, res) => {
        console.log("UPDATING " + req.query.read)
        await messageService.setToRead(req.query.read)

        res.status(200).send([1])
    }
)

module.exports = router