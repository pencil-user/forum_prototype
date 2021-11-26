const jwt = require('jsonwebtoken')
const config = require('config')
const CONSTS = require('../consts.js')
const k = require('../database/database.js')

async function getUserById(id) {
    let result = await k('users').select("*").where({ 'id': id })
    return result[0]
}

function auth(minimumLevel = 0) {
    return async (req, res, next) => {
        const token = req.header('x-auth-token')
        if (token) {
            try {
                const decoded = jwt.verify(token, config.get('secret'))
                console.log("auth::", decoded)
                let user = await getUserById(decoded._id)

                if (user.level < minimumLevel) {
                    res.status(401).send({ error: 'access denied' })
                    return;
                }

                req._user = user
                next()
                return;
            }
            catch (ex) {
                res.status(400).send({ error: 'invalid token' })
                return;
            }
        }

        if (minimumLevel < CONSTS.USER.LEVEL.USER) {
            req._user = { level: CONSTS.USER.LEVEL.GUEST, username: null, id: 0 }
            next()
        }
        else {
            res.status(401).send({ error: 'access denied' })
        }
    }
}

module.exports = auth