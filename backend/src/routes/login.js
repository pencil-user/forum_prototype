"use strict"

const jwt = require('jsonwebtoken')

const express = require('express')
const V = require('../validator/validator.js')
const Crypto = require("crypto-js/");
const config = require('config')
const userService = require('../services/userService.js')
const CONSTS = require('../consts.js')

const router = express.Router();

router.post('/',
    V.body({
        username: V.string(5).required(),
        password: V.string(6).required()
    }),
    async (req, res) => {

        let passwordHash = Crypto.SHA256(req.body.password).toString()
        let user = await userService.getUserByUsername(req.body.username)
        if (user) {

            if (passwordHash !== user.passwordhash) {
                res.status(401)
                res.send({ field: 'password', error: 'Wrong password.' })
                return;
            }

            if (user.approved != CONSTS.USER.APPROVAL.APPROVED) {
                res.status(401)
                res.send({ field: 'username', error: 'User not yet approved.' })
                return;
            }
            const token = jwt.sign({ _id: user.id }, config.get('secret'))
            res.status(200).send({ ...user, token: token })
        }
        else {
            res.status(404)
            res.send({ field: 'username', error: 'No such user.' })
        }
    }
)


module.exports = router
