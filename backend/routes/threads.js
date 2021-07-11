"use strict"

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')

const auth = require('../middleware/auth.js')

const router = express.Router();

router.get('/',
    async (req, res) =>
    {
        
        let count = k('posts').count('id').where('threads.id', k.ref('posts.thread_id')).as('post_count')
        let threads = await k('threads').select("threads.*", 'users.id as user_id', 'users.username', 'users.level as user_level', count).leftJoin('users', 'threads.created_by_id', 'users.id').orderBy([{column: 'threads.pinned', order:'desc'}, 'threads.created_on' ])
        res.json(threads)         
    }

)

router.get('/:id',
    V.params({id:V.number().round()}),
    async (req, res) =>
    {  
        let threads = await k('threads').select("*").where('id', req.params.id)
        res.json(threads[0])
    }    
)

router.post('/', auth(0),
    V.body({
        title: V.string().required(),
        thread_body: V.string().required(),
        pinned: V.number(),
        locked: V.number()
        }),
    async (req,res) =>{
        let insertion = {...req.body}
        if(req._user.level < 2) // only admin can pin/unpin or lock/unlock
        {
            if('pinned' in req.body || 'locked' in req.body)
            {
                res.status(401).send({error:'access denied'})
                return;
            }
        }

        if(req._user.id && req._user.id>0)
            insertion= {...req.body, created_by_id:req._user.id}
        else
            insertion = req.body

        let ids = await k('threads').insert(insertion)
        res.json({id: ids[0]})
    }
)

router.patch('/:id', auth(1),
    V.params({id:V.number().round()}),
    V.body({
        title: V.string(),
        thread_body: V.string(),
        pinned: V.number(),
        locked: V.number()
        }),
    async (req,res) =>{
        let id = req.params.id


        if(req._user.level < 2) // only admin can pin/unpin or lock/unlock
        {
            if('pinned' in req.body || 'locked' in req.body)
            {
                res.status(401).send({error:'access denied'})
                return;
            }
        }

        if(req._user.level<2 ) // admin can alter any thread, ordinary users can only alter their own
        {
            let posts = await k('threads').select('created_by_id').where('id', id)

            if(posts[0].created_by_id !== req._user.id)
            {
                res.status(401).send({error:'access denied'})
                return;                
            }
        }

        let ids = await k('threads').update(req.body).where('id', req.params.id)
        res.json({id: ids[0]})
    }
)

router.delete('/:id', auth(1),
    V.params({id:V.number().round()}),
    async (req,res) =>{

        let id = req.params.id

        if(req._user.level<2 ) // admin can delete any thread, ordinary users can only alter their own
        {
            let posts = await k('threads').select('created_by_id').where('id', id)

            if(posts[0].created_by_id !== req._user.id)
            {
                res.status(401).send({error:'access denied'})
                return;                
            }
        }

        let result  = await k('threads').del().where('id', id)
        let result2 = await k('posts').del().where('thread_id', id)
        res.json(result[0])

    }

)


module.exports = router