"use strict"

const jwt = require('jsonwebtoken')

const express = require('express')
const k = require('../database/database.js')
var Crypto = require("crypto-js/");
const privateKey = "privateKey11223344";

const router = express.Router();


router.post('/',
    async (req,res) =>{

        let passwordHash = Crypto.SHA256(req.body.password).toString()
        let users = await k('users').select("*").where({'username' : req.body.username, 'passwordhash': passwordHash, approved:1})
        if(users[0])
        {
            let user = users[0]
            const token = jwt.sign({_id:user.id}, privateKey)
            res.send({...user, token:token})
        }
        else
        {
            res.status(401)
            res.send({error:'wrong login'})
        }
    }
)


module.exports = router
