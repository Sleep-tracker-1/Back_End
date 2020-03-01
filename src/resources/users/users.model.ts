import { QueryBuilder } from 'knex'

import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'

export type User = {
  id: Id
  username: string
  password: string
  firstName: string
  email: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findBy = (filter: { [key: string]: any }): QueryBuilder =>
  db('user')
    .select('*')
    .where(filter)

export const findById = (id: Id): QueryBuilder<User> =>
  db('user')
    .where({ id: Number(id) })
    .first()

export const insert = ({
  firstName,
  ...rest
}: Omit<User, 'id'>): QueryBuilder<[User]> =>
  db('user').insert({ first_name: firstName, ...rest }, [
    'id',
    'username',
    'first_name',
    'email',
  ])

export const update = (id: Id, user: Omit<User, 'id'>): QueryBuilder<User> =>
  db('user')
    .where({ id: Number(id) })
    .update(user, ['id', 'username', 'first_name', 'email'])

export const remove = (id: Id): QueryBuilder<number> =>
  db('user')
    .where('id', Number(id))
    .del()

export default { findById, insert, update, remove }
