import Knex, { QueryBuilder } from 'knex'
import faker from 'faker'
import bcrypt from 'bcrypt'

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

exports.seed = async (knex: Knex): Promise<QueryBuilder> => {
  const users = await knex('user').select('username')

  users.forEach(user => {
    const firstName = faker.name.firstName()
    const updatedInfo = {
      username: user.username,
      password: bcrypt.hashSync(
        faker.internet.password(getRandomNumber(6, 18)),
        10
      ),
      first_name: firstName,
      email: faker.internet.email(firstName, faker.name.lastName()),
    }

    return knex('user')
      .where({ username: user.username })
      .update(updatedInfo, ['*'])
  })
}
