"use strict"

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')

var Crypto = require("crypto-js/");


const auth = require('../middleware/auth.js')
const router = express.Router();

router.post('/' ,
    V.body({
        username: V.string(5).required(),
        password: V.string(6).required(),
        email: V.email(),

    }),
    async (req,res) =>{

        let username = req.body.username
        let passwordhash = Crypto.SHA256(req.body.password).toString() 
        let email = req.body.email
        let level = 1

        /// verify email unique
        let ids1 = await k('users').select("*").where('email', email)

        if(ids1.length>0)
        {
            res.status(400 )
            res.send({field:'email', error:'There is already such email.'})
            return;
        }

        // verify usename unique
        let ids2 = await k('users').select("*").where('username', username)

        if(ids2.length>0)
        {
            res.status(400 )
            res.send({field:'username', error:'There is already such username.'})
            return;
        }

        let ids = await k('users').insert({username, passwordhash, email, level})
        res.json({id: ids[0]})
    }
)

router.get('/', auth(1),
    V.query({
        offset:   V.number().round().default(0),
        limit:    V.number(1,100).round().default(100),
        pending:  V.number(),
        username: V.string(3),
    }),
    async (req,res) =>{

        let result
        let query =  k('users').select("*").offset(req.query.offset).limit(req.query.limit)

        if(req.query?.pending)
        {
            query.andWhere('approved', 0)
        }

        if(req.query?.username)
        {
            query.andWhere(
                'username', 
                'like' ,  
                `%${req.query.username}%`
            )            
        }

        result = await query
            
        res.json(result)
    }
)

router.get('/:id',
    async (req,res) =>{
        let user = await k('users').select("*").where('id', req.params.id)
        let countThreads = await k('threads').count('id as number').where('created_by_id', req.params.id)
        let countPosts =   await k('posts').count('id as number').where('created_by_id', req.params.id)

        res.json(
            {
                ...user[0],
                threads: countThreads[0].number,
                posts:   countPosts[0].number,
            
            })

    }

)

router.patch('/:id', auth(2) ,
    V.params({id:V.number().round()}),
    V.body({
        username: V.string(5),
        //password: V.string(6),
        email: V.email(),
        level: V.number(),
        approved: V.number()
    }), 
    async (req,res) =>{
        console.log(req.body)
        let ids = await k('users').update(req.body).where('id', req.params.id)
        res.json(ids)

    }
)


router.delete('/:id', auth(2) ,
    V.params({id:V.number().round()}),
    async (req,res) =>{
        let ids = await k('users').delete().where('id', req.params.id)
        res.json(ids)
    }
)


module.exports = router
