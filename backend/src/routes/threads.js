"use strict"

const express = require('express')
const router = express.Router();

const V = require('../validator/validator.js')
const auth = require('../middleware/auth.js')
const threadService = require('../services/threadService.js')
const postService = require('../services/postService.js')

const CONSTS = require('../consts.js')

const USER_LEVEL = CONSTS.USER.LEVEL

router.get('/',
    V.query({
        offset: V.number().round().default(0),
        limit: V.number(1, 100).round().default(100)
    }),
    async (req, res) => {

        let threads = await threadService.getThreads(req.query.offset, req.query.limit)

        let threadCount = await threadService.countThreads()

        res.append('-offset', req.query.offset)
        res.append('-limit', req.query.limit)
        res.append('-total', threadCount)
        res.status(200).json(threads)
    }

)

router.get('/:id',
    V.params({ id: V.number().round() }),
    async (req, res) => {
        let thread = await threadService.getThreadById(req.params.id)
        res.status(200).json(thread)
    }
)

router.post('/', auth(USER_LEVEL.GUEST),
    V.body({
        title: V.string().required(),
        thread_body: V.string().required(),
        pinned: V.number(),
        locked: V.number()
    }),
    async (req, res) => {
        let insertion = { ...req.body }
        if (req._user.level < 2) // only admin can pin/unpin or lock/unlock
        {
            if ('pinned' in req.body || 'locked' in req.body) {
                res.status(401).send({ error: 'access denied' })
                return;
            }
        }

        if (req._user.id && req._user.id > 0)
            insertion = { ...req.body, created_by_id: req._user.id }
        else
            insertion = req.body

        let new_id = await threadService.insertThread(insertion)

        let result = await threadService.getThreadById(new_id)

        res.status(200).json(result[0])
    }
)

router.patch('/:id', auth(USER_LEVEL.USER),
    V.params({ id: V.number().round() }),
    V.body({
        title: V.string(),
        thread_body: V.string(),
        pinned: V.number(),
        locked: V.number()
    }),
    async (req, res) => {
        let id = req.params.id

        if (req._user.level < USER_LEVEL.ADMIN) // only admin can pin/unpin or lock/unlock
        {
            if ('pinned' in req.body || 'locked' in req.body) {
                res.status(401).send({ error: 'access denied' })
                return;
            }
        }

        if (req._user.level < USER_LEVEL.ADMIN) // admin can alter any thread, ordinary users can only alter their own
        {
            let posts = await threadService.getThreadById(id)

            if (posts[0].created_by_id !== req._user.id) {
                res.status(401).send({ error: 'access denied' })
                return;
            }
        }

        threadService.updateThread(req.body, id)
        let result = await threadService.getThreadById(id)

        res.status(200).json(result)
    }
)

router.delete('/:id', auth(USER_LEVEL.USER),
    V.params({ id: V.number().round() }),
    async (req, res) => {

        let id = req.params.id

        if (req._user.level < USER_LEVEL.ADMIN) // admin can delete any thread, ordinary users can only alter their own
        {
            let posts = await threadService.getThreadById(id)

            if (posts[0].created_by_id !== req._user.id) {
                res.status(401).send({ error: 'access denied' })
                return;
            }
        }

        await threadService.deleteThread(id)
        await postService.deletePostsByThread(id)
        res.json({ id: id })
    }
)

module.exports = router