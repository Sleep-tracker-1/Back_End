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
  db('users')
    .select('*')
    .where(filter)

export const findById = (id: Id): QueryBuilder<User> =>
  db('users')
    .where({ id: Number(id) })
    .first()

export const insert = (user: Omit<User, 'id'>): QueryBuilder<[User]> =>
  db('users').insert(user, ['id', 'username', 'first_name', 'email'])

export const update = (id: Id, user: Omit<User, 'id'>): QueryBuilder<User> =>
  db('users')
    .where({ id: Number(id) })
    .update(user, ['id', 'username', 'first_name', 'email'])

export const remove = (id: Id): QueryBuilder<number> =>
  db('users')
    .where('id', Number(id))
    .del()

export default { findById, insert, update, remove }
