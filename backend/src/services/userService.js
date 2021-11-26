const knex = require('../database/database.js')
const _ = require('lodash')

async function getUserById(id) {
    let result = await knex('users').select("*").where({ 'id': id })
    return result[0] ? result[0] : null
}

async function getUserByEmail(email) {
    let result = await knex('users').select("*").where('email', email)
    return result[0] ? result[0] : null
}

async function getUserByUsername(username) {
    let result = await knex('users').select("*").where('username', username)
    return result[0] ? result[0] : null
}

async function insertUser(insertion) {
    let ids = await knex('users').insert(insertion)
    return ids[0]

}

async function getUsers({ offset = 0, limit = 10, pending = null, username = null }) {
    let query = knex('users').select("*").offset(offset).limit(limit)

    if (!_.isNull(pending)) {
        query.andWhere('approved', 0)
    }

    if (!_.isNull(username)) {
        query.andWhere(
            'username',
            'like',
            `%${req.query.username}%`
        )
    }

    return await query
}

async function updateUser(update, id) {
    return (await knex('users').update(update).where('id', id))[0]

}

async function deleteUser(id) {
    return (await knex('users').del().where('id', id))[0]
}

module.exports = { getUserById, getUserByEmail, getUserByUsername, insertUser, getUsers, updateUser, deleteUser }