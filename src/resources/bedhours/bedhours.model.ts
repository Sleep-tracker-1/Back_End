import { QueryBuilder } from 'knex'

import { add } from 'date-fns'
import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'

export type Bedhour = {
  id: Id
  bedtime: Date
  waketime: Date
  user_id: Id
}

export const find = (startDate: Date, endDate: Date): QueryBuilder =>
  db('bedhours')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .select('id', 'bedtime', 'waketime', 'user_id as userId')

export const findById = (id: Id): QueryBuilder<Bedhour> =>
  db('bedhours')
    .where({ id })
    .first()
    .select('id', 'bedtime', 'waketime', 'user_id as userId')

export const insert = (bedhour: Omit<Bedhour, 'id'>): QueryBuilder<[Bedhour]> =>
  db('bedhours').insert(bedhour, [
    'id',
    'bedtime',
    'waketime',
    'user_id as userId',
  ])

export const update = (
  id: Id,
  bedHour: Omit<Bedhour, 'id'>
): QueryBuilder<[Bedhour]> =>
  db('bedhours')
    .where({ id })
    .update(
      {
        bedtime: bedHour.bedtime,
        waketime: bedHour.waketime,
        user_id: bedHour.user_id,
      },
      ['id', 'bedtime', 'waketime', 'user_id as userId']
    )

export const remove = (id: Id): QueryBuilder<number> =>
  db('bedhours')
    .where({ id })
    .del()

export default {
  find,
  findById,
  insert,
  update,
  remove,
}
