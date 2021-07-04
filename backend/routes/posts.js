"use strict"

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')


const auth = require('../middleware/auth.js')
const router = express.Router();


router.get('/:id',
    async (req,res) =>{
        let id = req.params.id
        let result = await k('posts').select("*").where('id', id)
        res.json(result[0])

    }
)

router.get('/',
    async (req,res) =>{

        let query = k('posts').select("posts.*", 'users.id as user_id', 'users.username', 'users.level as user_level').leftJoin('users', 'posts.created_by_id', 'users.id').orderBy('created_on')

        if(req.query?.thread_id)
        {
            let thread_id = req.query.thread_id
            query = query.where('posts.thread_id', thread_id)
        }

        if(req.query?.offset && req.query?.limit)
        {
            res.append('-offset', req.query.offset)
            res.append('-limit', req.query.offset)
                    
            query = query.offset(req.query.offset).limit(req.query.limit)
        }        

        let result = await query
        
        let result2 = await k('posts').count('*').where('thread_id', req.query?.thread_id)

        res.append('-total', result2[0]['count(*)'])
        res.json(result)
    }
)

router.post('/', auth(0) ,
    V.body({
        post_body: V.string().required(),
        thread_id: V.number().required()
        }),
    async (req,res) =>{

        let insertion = req.body

        // verify thread exists and is not locked

        let threads = await k('threads').select("*").where('id', req.body.thread_id)
        
        if(!('id' in threads[0]) || threads[0].locked ==1)
        {
            res.status(401).send({error:'access denied'})
            return;             
        }

        //

        if(req._user.id && req._user.id>0)
            insertion= {...req.body, created_by_id:req._user.id}
        else
            insertion = req.body
        
        console.log('insertion', insertion)

        let ids = await k('posts').insert(insertion)
        res.json({id: ids[0]})
    }
)


router.patch('/:id', auth(1),
    V.body({
        post_body: V.string().required(),
        thread_id: V.number()
        }),
    async (req,res) =>{
        let id = req.params.id

        // if we want to change thread where the post is in, we must be admin

        if('thread_id' in req.body && req.user.level<2)
        {
            res.status(401).send({error:'access denied'})
            return;             
        }

        if(req._user.level<2 ) // admin can alter any post, ordinary users can only alter their own
        {
            let posts = await k('posts').select('id', 'created_by_id').where('id', id)

            if(!('id' in posts[0]) || posts[0].created_by_id !== req._user.id)
            {
                res.status(401).send({error:'access denied'})
                return;                
            }
        }

        let new_id = await k('posts').update(req.body).where('id', id)
        let result = await k('posts').select('*').where('id', new_id)
        res.json(result)
    }
)

router.delete('/:id', auth(1),
    async (req,res) =>{
        let id = req.params.id

        if(req._user.level<2 ) // admin can delete any post, ordinary users can only delete their own
        {
            let posts = await k('posts').select('created_by_id').where('id', id)

            if(posts[0].created_by_id !== req._user.id)
            {
                res.status(401).send({error:'access denied'})
                return;                
            }
        }

        let result = await k('posts').del().where('id', id)
        res.json(result)

    }
)



module.exports = router