'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const knex_1 = tslib_1.__importDefault(require('knex'))
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../knexfile')
const dbEnv = process.env.NODE_ENV || 'development'
exports.default = knex_1.default(config[dbEnv])
