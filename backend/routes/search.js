"use strict"

const express = require('express')
const k = require('../database/database.js')

const router = express.Router();


router.get('/:query',
    async (req, res) =>
    {
        let query = req.params.query

        if(query.length<3)
        {
            res.status(401).send({error:'bad request'})
        }
        
        let result = await k('threads').select('*').where('title', 'like' ,  `%${query}%`)
        res.send(result)

    }
)

module.exports = router