import Knex, { QueryBuilder } from 'knex'
import bcrypt from 'bcrypt'

exports.seed = (knex: Knex): QueryBuilder =>
  knex('users').insert([
    {
      username: 'wes',
      password: bcrypt.hashSync('password', 10),
    },
    {
      username: 'cai',
      password: bcrypt.hashSync('password', 10),
    },
    {
      username: 'reanna',
      password: bcrypt.hashSync('password', 10),
    },
    {
      username: 'josh',
      password: bcrypt.hashSync('password', 10),
    },
    {
      username: 'nicholas',
      password: bcrypt.hashSync('password', 10),
    },
    {
      username: 'janessa',
      password: bcrypt.hashSync('password', 10),
    },
    {
      username: 'eduardo',
      password: bcrypt.hashSync('password', 10),
    },
  ])
