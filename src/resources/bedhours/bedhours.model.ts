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
  db('bedhours').whereBetween('waketime', [
    startDate,
    add(endDate, { days: 1 }),
  ])

export const findById = (id: Id): QueryBuilder<Bedhour> =>
  db('bedhours')
    .where({ id })
    .first()

export const insert = (bedhour: Omit<Bedhour, 'id'>): QueryBuilder<[Bedhour]> =>
  db('bedhours').insert(bedhour, ['*'])

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
      ['*']
    )

export const remove = (id: Id): QueryBuilder<number> =>
  db('bedhours')
    .where({ id })
    .del()
