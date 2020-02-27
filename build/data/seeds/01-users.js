'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const bcrypt_1 = tslib_1.__importDefault(require('bcrypt'))
exports.seed = knex =>
  knex('users').insert([
    {
      username: 'wes',
      password: bcrypt_1.default.hashSync('password', 10),
    },
    {
      username: 'cai',
      password: bcrypt_1.default.hashSync('password', 10),
    },
    {
      username: 'reanna',
      password: bcrypt_1.default.hashSync('password', 10),
    },
    {
      username: 'josh',
      password: bcrypt_1.default.hashSync('password', 10),
    },
    {
      username: 'nicholas',
      password: bcrypt_1.default.hashSync('password', 10),
    },
    {
      username: 'janessa',
      password: bcrypt_1.default.hashSync('password', 10),
    },
    {
      username: 'eduardo',
      password: bcrypt_1.default.hashSync('password', 10),
    },
  ])
