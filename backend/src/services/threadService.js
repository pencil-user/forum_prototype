"use strict"

const knex = require('../database/database.js')

async function getThreads(offset, limit) {
    let postCount =
        knex('posts').count('id')
            .where(
                'threads.id',
                knex.ref('posts.thread_id')
            ).as('post_count')

    let lastPostCreatedOn =
        knex('posts').max('created_on')
            .where(
                'threads.id',
                knex.ref('posts.thread_id')
            ).as('last_post_created_on')

    let threads = await
        knex('threads').select(
            "threads.*",
            'users.id as user_id',
            'users.username',
            'users.level as user_level',
            postCount,
            lastPostCreatedOn,
        ).leftJoin(
            'users',
            'threads.created_by_id',
            'users.id'
        ).orderByRaw(
            `
            threads.pinned DESC,
            CASE
            WHEN last_post_created_on IS NULL THEN threads.created_on
            ELSE last_post_created_on
            END DESC`
        ).offset(offset).limit(limit)

    return threads
}

async function countThreads() {
    return (await knex('threads').count('id', { 'as': 'all' }))[0]['all']
}

async function countThreadsByUser(userId) {
    return (await knex('threads').count('id as number').where('created_by_id', userId))[0].number
}

async function getThreadById(id) {
    return (await knex('threads').select("*").where('id', id))[0]
}

async function insertThread(insertion) {
    return (await knex('threads').insert(insertion))[0]
}

async function updateThread(update, id) {
    return (await knex('threads').update(update).where('id', id))[0]
}

async function deleteThread(id) {
    return (await knex('threads').del().where('id', id))[0]
}

function threadsQuery(query) {
    return knex('threads')
        .where(
            'title',
            'like',
            `%${query}%`
        ).orWhere(
            'thread_body',
            'like',
            `%${query}%`
        )
}

async function findThreads(query, offset = 0, limit = 100) {
    return await threadsQuery(query).select('*').offset(offset).limit(limit)
}

async function countFindThreads(query) {
    return (await threadsQuery(query).count('id', { 'as': 'all' }))[0]['all']
}

module.exports = { getThreads, countThreads, findThreads, countFindThreads , getThreadById, insertThread, updateThread, deleteThread, countThreadsByUser }