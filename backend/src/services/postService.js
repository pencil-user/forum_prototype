"use strict"

const knex = require('../database/database.js')

async function getPostById(id) {
    return (await knex('posts').select('*').where('id', id))[0]
}

async function getPostsByThread(threadId, offset = 0, limit = 10) {
    let query =
        knex('posts').select(
            "posts.*",
            'users.id as user_id',
            'users.username',
            'users.level as user_level'
        ).leftJoin(
            'users',
            'posts.created_by_id',
            'users.id'
        ).where(
            'posts.thread_id',
            threadId
        ).orderBy(
            'created_on'
        ).offset(offset).limit(limit)

    return await query
}

async function countPostsByThread(threadId) {
    return (await knex('posts').count('*').where('thread_id', threadId))[0]['count(*)']
}

async function countPostsByUser(userId) {
    return (await knex('posts').count('id as number').where('created_by_id', userId))[0].number
}

async function insertPost(insertion) {
    return (await knex('posts').insert(insertion))[0]
}

async function updatePost(update, id) {
    return (await knex('posts').update(update).where('id', id))[0]
}

async function deletePost(id) {
    return (await knex('posts').del().where('id', id))[0]
}

async function deletePostsByThread(threadId) {
    return (knex('posts').del().where('thread_id', threadId))[0]
}

module.exports = { getPostsByThread, deletePostsByThread, getPostById, countPostsByThread, countPostsByUser, insertPost, updatePost, deletePost }