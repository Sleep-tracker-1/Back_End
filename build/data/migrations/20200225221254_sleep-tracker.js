'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.increments()
    table
      .string('username')
      .notNullable()
      .unique()
    table.string('password').notNullable()
  })
exports.down = knex => knex.schema.dropTableIfExists('users')
