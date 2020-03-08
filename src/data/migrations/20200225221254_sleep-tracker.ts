import Knex, { SchemaBuilder } from 'knex'

export const up = (knex: Knex): SchemaBuilder =>
  knex.schema
    .createTable('user', table => {
      table.increments()
      table
        .string('username')
        .notNullable()
        .unique()
      table.string('password').notNullable()
      table.string('first_name').notNullable()
      table
        .string('email')
        .notNullable()
        .unique()
    })

    .createTable('bedhours', table => {
      table.increments()
      table.dateTime('bedtime')
      table.dateTime('waketime')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })

    .createTable('mood', table => {
      table.increments()
      table.integer('wake_mood').unsigned()
      table.integer('midday_mood').unsigned()
      table.integer('night_mood').unsigned()
      table
        .integer('night_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('bedhours')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })

    .createTable('tiredness', table => {
      table.increments()
      table.integer('wake_tired').unsigned()
      table.integer('midday_tired').unsigned()
      table.integer('night_tired').unsigned()
      table
        .integer('night_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('bedhours')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })

export const down = (knex: Knex): SchemaBuilder =>
  knex.schema
    .dropTableIfExists('tiredness')
    .dropTableIfExists('mood')
    .dropTableIfExists('user')
    .dropTableIfExists('bedhours')
