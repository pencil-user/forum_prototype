"use strict"

const express = require('express')
const router = express.Router();
const userService = require('../services/userService.js')
const postService = require('../services/postService.js')
const threadService = require('../services/threadService.js')

const k = require('../database/database.js')
const V = require('../validator/validator.js')
const auth = require('../middleware/auth.js')

const Crypto = require("crypto-js/");
const CONSTS = require('../consts.js')

const USER_LEVEL = CONSTS.USER.LEVEL

router.post('/',
    V.body({
        username: V.string(5).required(),
        password: V.string(6).required(),
        email: V.email(),

    }),
    async (req, res) => {

        let username = req.body.username
        let passwordhash = Crypto.SHA256(req.body.password).toString()
        let email = req.body.email
        let level = USER_LEVEL.USER

        /// verify email unique
        let result1 = await userService.getUserByEmail(email)

        if (result1) {
            res.status(400)
            res.send({ field: 'email', error: 'There is already such email.' })
            return;
        }

        // verify usename unique
        let result2 = await userService.getUserByUsername(username)

        if (result2) {
            res.status(400)
            res.send({ field: 'username', error: 'There is already such username.' })
            return;
        }

        let id = await k('users').insert({ username, passwordhash, email, level })
        res.json({ id: id })
    }
)

router.get('/', auth(USER_LEVEL.USER),
    V.query({
        offset: V.number().round().default(0),
        limit: V.number(1, 100).round().default(100),
        pending: V.number(),
        username: V.string(3),
    }),
    async (req, res) => {
        let result = await userService.getUsers(req.query)

        res.json(result)
    }
)

router.get('/:id',
    async (req, res) => {
        let user = await userService.getUserById(req.params.id)
        let countThreads = await threadService.countThreadsByUser(req.params.id)
        let countPosts = await postService.countPostsByUser(req.params.id)

        res.json(
            {
                ...user,
                threads: countThreads,
                posts: countPosts,
            })
    }

)

router.patch('/:id', auth(USER_LEVEL.ADMIN),
    V.params({ id: V.number().round() }),
    V.body({
        username: V.string(5),
        //password: V.string(6),
        email: V.email(),
        level: V.number(),
        approved: V.number()
    }),
    async (req, res) => {
        console.log(req.body)
        let id = await userService.updateUser(req.body, req.params.id)
        res.json(id)

    }
)

router.delete('/:id', auth(USER_LEVEL.ADMIN),
    V.params({ id: V.number().round() }),
    async (req, res) => {
        let id = await userService.deleteUser(req.params.id)
        res.json(id)
    }
)

module.exports = router
