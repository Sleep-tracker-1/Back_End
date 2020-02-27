import Knex, { QueryBuilder } from 'knex'
import faker from 'faker'

const generateUsers = (): { username: string }[] =>
  [...Array(457)].map(_user => {
    return {
      username: faker.internet.userName(),
    }
  })

exports.seed = (knex: Knex): QueryBuilder =>
  knex('user').insert(generateUsers())
