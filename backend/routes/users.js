"use strict"

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')

var Crypto = require("crypto-js/");


const auth = require('../middleware/auth.js')
const router = express.Router();

router.post('/' ,
    V.body({
        username: V.string().required(),
        password: V.string().required(),
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

router.get('/', auth(2) ,
    async (req,res) =>{

        let result
        let query =  k('users').select("*")

        if(req.query?.pending)
        {
            result = await query.where('approved', 0)
        }
        else
        {
            result = await query
        }
            
        res.json(result)
    }
)

router.patch('/:id', auth(2) ,
    V.body({
        username: V.string(),
        password: V.string(),
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
    async (req,res) =>{
        let ids = await k('users').delete().where('id', req.params.id)
        res.json(ids)
    }
)


module.exports = router
