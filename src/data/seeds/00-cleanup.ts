import Knex, { Seeder } from 'knex'
import cleaner from 'knex-cleaner'

exports.seed = (knex: Knex): Seeder =>
  cleaner.clean(knex, {
    mode: 'truncate',
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  })
