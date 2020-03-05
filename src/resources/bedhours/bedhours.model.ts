import { QueryBuilder } from 'knex'

import { add, sub } from 'date-fns'
import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'

export type Bedhour = {
  id: Id
  bedtime: Date
  waketime: Date
  userId: Id
}

export const find = (
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[Bedhour]> =>
  db('bedhours')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .select('id', 'bedtime', 'waketime', 'user_id as userId')

export const findWaketimeFromMidday = (): QueryBuilder<[Bedhour]> =>
  db('bedhours')
    .select('id')
    .orderBy('id', 'desc')
    .limit(1)

export const findBedtime = async (
  startDate: Date,
  endDate: Date
): Promise<Bedhour[]> =>
  db('bedhours')
    .whereBetween('bedtime', [startDate, endDate])
    .select('id', 'bedtime')

export const findById = (id: Id): QueryBuilder<Bedhour> =>
  db('bedhours')
    .where({ id })
    .first()
    .select('id', 'bedtime', 'waketime', 'user_id as userId')

export const insert = (bedhour: {
  waketime: Date
  bedtime: Date
  userId: number | undefined
}): QueryBuilder<[Bedhour]> =>
  db('bedhours').insert(
    {
      bedtime: bedhour.bedtime,
      waketime: bedhour.waketime,
      user_id: bedhour.userId,
    },
    ['id', 'bedtime', 'waketime', 'user_id as userId']
  )

export const update = (
  id: Id,
  bedHour: {
    waketime: Date
    bedtime: Date
    userId: number | undefined
  }
): QueryBuilder<[Bedhour]> =>
  db('bedhours')
    .where({ id })
    .update(
      {
        bedtime: bedHour.bedtime,
        waketime: bedHour.waketime,
        user_id: bedHour.userId,
      },
      ['id', 'bedtime', 'waketime', 'user_id as userId']
    )

export const remove = (id: Id): QueryBuilder<number> =>
  db('bedhours')
    .where({ id })
    .del()

export default {
  find,
  findBedtime,
  findWaketimeFromMidday,
  findById,
  insert,
  update,
  remove,
}
