import Knex from 'knex'

export const up = (knex: Knex): Promise<void> =>
  knex.schema.table('user', table => {
    table.string('password')
    table.string('first_name')
    table.string('email').unique()
    table.unique(['username'])
  })

export const down = (knex: Knex): Promise<void> =>
  knex.schema.table('user', table => {
    table.dropColumn('password')
    table.dropColumn('first_name')
    table.dropColumn('email')
    table.dropUnique(['username'])
  })
