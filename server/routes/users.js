"use strict"

const express = require('express')
const k = require('./database.js')
var Crypto = require("crypto-js/");


const auth = require('./auth.js')
const router = express.Router();

router.post('/' ,
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
            res.send({error:'There is already such email'})
            return;
        }

        // verify usename unique
        let ids2 = await k('users').select("*").where('username', username)

        if(ids2.length>0)
        {
            res.status(400 )
            res.send({error:'There is already such username'})
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
