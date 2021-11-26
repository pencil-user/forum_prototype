const knex = require('../database/database.js')

async function getAllConversationStarters(userId) {
    let messageCount =
        knex('messages').count('id')
            .where(
                'replay_to',
                knex.ref('msgid')
            ).as('message_count')

    let unreadCount =
        knex('messages').count('id')
            .where(
                'replay_to',
                knex.ref('msgid')
            ).andWhere(
                'read',
                0
            ).andWhere(
                'recipient_id',
                userId
            ).as('unread_count')


    let result = await
        knex('messages').select(
            'messages.*',

            'messages.id as msgid',

            'sender.username as sender_name',
            'sender.level as sender_level',

            'recipient.username as recipient_name',
            'recipient.level as recipient_level',

            messageCount,
            unreadCount

        ).leftJoin(
            { sender: 'users' },
            'messages.sender_id', '=', 'sender.id'
        ).leftJoin(
            { recipient: 'users' },
            'messages.recipient_id', '=', 'recipient.id'
        ).where(
            t => t.where(
                'sender_id',
                userId
            ).orWhere(
                'recipient_id',
                userId)
        ).andWhere(
            t => t.whereNull('replay_to')
        ).orderBy('created_on', 'desc')

    return result
}

async function countUnreadMessagesByUser(userId) {
    let result = await knex('messages').count('id', { 'as': 'unread' })
        .where(
            'recipient_id',
            userId
        ).andWhere(
            'read',
            0
        )

    return result[0]['unread']
}

async function insertMessage(insertion) {
    return (await knex('messages').insert(insertion))[0]
}

async function getOneConversation(convoId) {
    let conversation_starter = await
        knex('messages').select(
            'messages.*',

            'sender.username as sender_name',
            'sender.level as sender_level',

            'recipient.username as recipient_name',
            'recipient.level as recipient_level',

        ).leftJoin(
            { sender: 'users' },
            'messages.sender_id', '=', 'sender.id'
        ).leftJoin(
            { recipient: 'users' },
            'messages.recipient_id', '=', 'recipient.id'
        ).where('messages.id', convoId)

    let messages = await
        knex('messages').select(
            'messages.*',

            'sender.username as sender_name',
            'sender.level as sender_level',

            'recipient.username as recipient_name',
            'recipient.level as recipient_level',
        ).leftJoin(
            { sender: 'users' },
            'messages.sender_id', '=', 'sender.id'
        ).leftJoin(
            { recipient: 'users' },
            'messages.recipient_id', '=', 'recipient.id'
        ).where('messages.replay_to', convoId).orderBy('created_on')

    return {
        conversation: conversation_starter[0],
        messages: messages
    }
}

async function setToRead(id) {
    await knex('messages').update({ 'read': 1 }).where('id', id)
    await knex('messages').update({ 'read': 1 }).where('replay_to', id)
}

module.exports = { getAllConversationStarters, countUnreadMessagesByUser, insertMessage, getOneConversation, setToRead }