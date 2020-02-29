import Knex, { SchemaBuilder } from 'knex'

export const up = (knex: Knex): SchemaBuilder =>
  knex.schema.createTable('user', table => {
    table.increments()
    table
      .string('username')
      .notNullable()
      .unique()
    table.string('password').notNullable()
  })

export const down = (knex: Knex): SchemaBuilder =>
  knex.schema.dropTableIfExists('user')
