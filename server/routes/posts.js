"use strict"

const express = require('express')
const k = require('./database.js')

const auth = require('./auth.js')
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
    async (req,res) =>{

        let insertion = req.body

        if(req._user.id && req._user.id>0)
            insertion= {...req.body, created_by_id:req._user.id}
        else
            insertion = req.body
        
        console.log('insertion', insertion)

        let ids = await k('posts').insert(insertion)
        res.json({id: ids[0]})
    }
)


router.patch('/:id',
    async (req,res) =>{
        let id = req.params.id
        let result = await k('posts').update(req.body).where('id', id)
        res.json(result)
    }
)

router.delete('/:id',
    async (req,res) =>{
        let id = req.params.id
        let result = await k('posts').del().where('id', id)
        res.json(result)

    }
)



module.exports = router