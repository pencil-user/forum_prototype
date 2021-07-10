"use strict"

const jwt = require('jsonwebtoken')

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')
var Crypto = require("crypto-js/");
const config = require('config')

const router = express.Router();


router.post('/',
    V.body({
        username: V.string(5).required(),
        password: V.string(6).required()
        }),
    async (req,res) =>{

        let passwordHash = Crypto.SHA256(req.body.password).toString()
        let users = await k('users').select("*").where({'username' : req.body.username/*, 'passwordhash': passwordHash, approved:1*/})
        if(users[0])
        {
            let user = users[0]

            if(passwordHash !== user.passwordhash)
            {
                res.status(401)
                res.send({field:'password', error:'Wrong password.'})
                return;
            }

            if(user.approved !=1)
            {
                res.status(401)
                res.send({field:'username', error:'User not yet approved.'}) 
                return;              
            }

            const token = jwt.sign({_id:user.id}, config.get('secret'))
            res.send({...user, token:token})
        }
        else
        {
            res.status(401)
            res.send({field:'username', error:'No such user.'})
            
        }
    }
)


module.exports = router
