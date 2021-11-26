"use strict"

const express = require('express')
const postService = require('../services/postService.js')
const threadService = require('../services/threadService.js')
const V = require('../validator/validator.js')

const auth = require('../middleware/auth.js')
const router = express.Router();

const CONSTS = require('../consts.js')

const USER_LEVEL = CONSTS.USER.LEVEL

router.get('/:id',
    V.params({ id: V.number().round() }),
    async (req, res) => {
        let id = req.params.id
        let result = await postService.getPostById(id)
        res.json(result)
    }
)

router.get('/',
    V.query(
        {
            thread_id: V.number().round().required(),
            offset: V.number().round().default(0),
            limit: V.number(1, 100).round().default(100)
        }
    ),
    async (req, res) => {
        let result = await postService.getPostsByThread(req.query.thread_id, req.query.offset, req.query.limit)

        let result2 = await postService.countPostsByThread(req.query.thread_id)

        res.append('-offset', req.query.offset)
        res.append('-limit', req.query.limit)
        res.append('-total', result2)
        res.status(200).json(result)
    }
)

router.post('/', auth(USER_LEVEL.GUEST),
    V.body({
        post_body: V.string().required(),
        thread_id: V.number().round().required()
    }),
    async (req, res) => {

        // verify thread exists and is not locked

        let thread = await threadService.getThreadById(req.body.thread_id)

        if (!('id' in thread) || thread.locked == 1) {
            res.status(401).send({ error: 'access denied' })
            return;
        }

        let insertion = req.body

        if (req._user.id && req._user.id > 0)
            insertion = { ...req.body, created_by_id: req._user.id }
        else
            insertion = req.body

        console.log('insertion', insertion)

        let new_id = await postService.insertPost(insertion)
        let result = await postService.getPostById(new_id)
        res.status(200).json(result)
    }
)


router.patch('/:id', auth(USER_LEVEL.USER),
    V.params({ id: V.number().round() }),
    V.body({
        post_body: V.string().required(),
        thread_id: V.number().round()
    }),
    async (req, res) => {
        let id = req.params.id

        // if we want to change thread where the post is in, we must be admin

        if ('thread_id' in req.body && req.user.level < USER_LEVEL.ADMIN) {
            res.status(401).send({ error: 'access denied' })
            return;
        }

        if (req._user.level < USER_LEVEL.ADMIN) // admin can alter any post, ordinary users can only alter their own
        {
            let post = await postService.getPostById(id)

            if (!('id' in post) || post.created_by_id !== req._user.id) {
                res.status(401).send({ error: 'access denied' })
                return;
            }
        }

        await postService.updatePost(req.body, id)
        let result = await postService.getPostById(id)
        res.status(200).json(result)
    }
)

router.delete('/:id', auth(USER_LEVEL.USER),
    V.params({ id: V.number().round() }),
    async (req, res) => {
        let id = req.params.id

        if (req._user.level < USER_LEVEL.ADMIN) // admin can delete any post, ordinary users can only delete their own
        {
            let post = await postService.getPostById(id)

            if (post.created_by_id !== req._user.id) {
                res.status(401).send({ error: 'access denied' })
                return;
            }
        }

        let result = await postService.deletePost(id)
        res.status(200).json(result)

    }
)



module.exports = router