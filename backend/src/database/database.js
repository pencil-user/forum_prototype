"use strict"

const config = require('config')

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : config.get('MySQL.host'),
        user : config.get('MySQL.user'),
        password : config.get('MySQL.password'),
        database :  config.get('MySQL.database'),
        dateStrings: true
    }
})

module.exports = knex
