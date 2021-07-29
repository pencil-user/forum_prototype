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

        let result = await  
            k('threads').select('*')
            .where(
                'title', 
                'like' ,  
                `%${input}%`
            ).orWhere(
                'thread_body', 
                'like' , 
                `%${input}%`
            ).offset(req.query.offset).limit(req.query.limit)
        
        let queryCount = await
            k('threads')
            .count('id', {'as': 'all'})
            .where(
                'title', 
                'like' ,  
                `%${input}%`
            ).orWhere(
                'thread_body', 
                'like' , 
                `%${input}%`)            

        res.append('-offset', req.query.offset)
        res.append('-limit', req.query.limit)
        res.append('-count', queryCount[0]['all'])

        res.status(200).send(result)

    }
)

module.exports = router