import { QueryBuilder } from 'knex'

import { add, sub } from 'date-fns'
import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'

export type Bedhour = {
  id: Id
  bedtime: Date
  waketime: Date
  wakeDate: string
  userId: Id
}

export const find = (
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder =>
  db('bedhours')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .select(
      'id',
      'bedtime',
      'waketime',
      'wake_date as wakeDate',
      'user_id as userId'
    )

export const findById = (id: Id): QueryBuilder<Bedhour> =>
  db('bedhours')
    .where({ id })
    .first()
    .select(
      'id',
      'bedtime',
      'waketime',
      'wake_date as wakeDate',
      'user_id as userId'
    )

export const insert = (bedhour: {
  waketime: Date
  bedtime: Date
  wakeDate: string
  userId: number | undefined
}): QueryBuilder<[Bedhour]> =>
  db('bedhours').insert(
    {
      bedtime: bedhour.bedtime,
      waketime: bedhour.waketime,
      wake_date: bedhour.wakeDate,
      user_id: bedhour.userId,
    },
    ['id', 'bedtime', 'waketime', 'wake_date as wakeDate', 'user_id as userId']
  )

export const update = (
  id: Id,
  bedHour: {
    waketime: Date
    bedtime: Date
    wakeDate: string
    userId: number | undefined
  }
): QueryBuilder<[Bedhour]> =>
  db('bedhours')
    .where({ id })
    .update(
      {
        bedtime: bedHour.bedtime,
        waketime: bedHour.waketime,
        wake_date: bedHour.wakeDate,
        user_id: bedHour.userId,
      },
      [
        'id',
        'bedtime',
        'waketime',
        'wake_date as wakeDate',
        'user_id as userId',
      ]
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
