const jwt = require('jsonwebtoken')
const express = require("express")
const k = require('./database.js')
const privateKey = "privateKey11223344";

const router = express.Router();

async function getUserById(id)
{
    let result = await k('users').select("*").where({'id' : id})
    return result[0]
}

function auth(minimumLevel=0)
{
    return async (req, res, next) =>
    {
        const token = req.header('x-auth-token')
        if(token)
        {
            try {
                const decoded = jwt.verify(token, privateKey)
                console.log("auth::", decoded)
                let user = await getUserById(decoded._id)

                if(user.level< minimumLevel)
                {
                    res.status(401).send({error:'access denied'})
                    return null
                }

                req._user = user              
                next()
                return null
            }
            catch (ex)
            {
                res.status(400).send({error:'invalid token'})
                return null
            }        
        }

        if(minimumLevel<1)
        {
            req._user = {level:0, username: null, id:0}
            next()
        }
        else
        {
            res.status(401).send({error:'access denied'})
        }
    }
}

module.exports = auth