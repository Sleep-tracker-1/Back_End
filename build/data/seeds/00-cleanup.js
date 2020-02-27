'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const knex_cleaner_1 = tslib_1.__importDefault(require('knex-cleaner'))
exports.seed = knex =>
  knex_cleaner_1.default.clean(knex, {
    mode: 'truncate',
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  })
