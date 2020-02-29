import Knex, { QueryBuilder } from 'knex'
import faker from 'faker'
import bcrypt from 'bcrypt'
import getRandomNumber from '../../utils/randomNumberGenerator'

const generateUsers = (
  size: number
): {
  username: string
  password: string
  first_name: string
  email: string
}[] =>
  [...Array(size)].map(_user => {
    const firstName = faker.name.firstName()
    return {
      username: faker.internet.userName(firstName),
      password: bcrypt.hashSync(
        faker.internet.password(getRandomNumber(6, 18)),
        10
      ),
      first_name: firstName,
      email: faker.internet.email(firstName, faker.name.lastName()),
    }
  })

export const seed = (knex: Knex): QueryBuilder =>
  knex('user').insert(
    generateUsers(50).concat(
      {
        username: 'Eddie',
        password: bcrypt.hashSync('password', 10),
        first_name: 'Eddie',
        email: 'eddiejdev@gmail.com',
      },
      {
        username: 'Josh',
        password: bcrypt.hashSync('password', 10),
        first_name: 'Josh',
        email: 'joshua.c.luscombe@gmail.com',
      },
      {
        username: 'Reanna',
        password: bcrypt.hashSync('password', 10),
        first_name: 'Reanna',
        email: 'reannalacasse@gmail.com',
      },
      {
        username: 'Janessa',
        password: bcrypt.hashSync('password', 10),
        first_name: 'Janessa',
        email: 'Janessa.mathews@gmail.com',
      },
      {
        username: 'Cai',
        password: bcrypt.hashSync('password', 10),
        first_name: 'Cai',
        email: 'cai.nowicki@gmail.com',
      },
      {
        username: 'Wes',
        password: bcrypt.hashSync('password', 10),
        first_name: 'Wes',
        email: 'fellerwestley@gmail.com',
      }
    )
  )

export default seed
