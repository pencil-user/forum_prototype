"use strict"

const express = require('express')
const k = require('../database/database.js')
const V = require('../validator/validator.js')

const router = express.Router();

router.get('/:input',
    V.params({input: V.string(3)}),
    V.query(
        {
            offset: V.number().round().default(0),
            limit:  V.number(1,100).round().default(100)
        }),
    async (req, res) =>
    {
        let input = req.params.input

        console.log('INPUT', req.params.input)
        console.log('OFFSET', req.query.offset)
        console.log('LIMIT', req.query.limit)

        let query =  k('threads').select('*').where('title', 'like' ,  `%${input}%`).orWhere('thread_body', 'like' , `%${input}%`)

        query = query.offset(req.query.offset).limit(req.query.limit)

        res.append('-offset', req.query.offset)
        res.append('-limit', req.query.limit)
                
        let result = await query
        res.send(result)

    }
)

module.exports = router