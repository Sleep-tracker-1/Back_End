import Knex, { QueryBuilder } from 'knex'
import bcrypt from 'bcrypt'
import faker from 'faker'

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

const generateUsers = (): { username: string; password: string }[] =>
  [...Array(50)].map(_user => {
    return {
      username: faker.internet.userName(),
      password: bcrypt.hashSync(
        faker.internet.password(getRandomNumber(6, 18)),
        10
      ),
    }
  })

exports.seed = (knex: Knex): QueryBuilder =>
  knex('users').insert(
    generateUsers().concat(
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
      }
    )
  )
