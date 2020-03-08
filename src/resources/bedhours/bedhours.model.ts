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
  userId: Id,
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[Bedhour]> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .select('bedhours.id as id', 'bedtime', 'waketime', 'user_id as userId')

export const findWaketimeFromMidday = (userId: Id): QueryBuilder<[Bedhour]> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .select('bedhours.id as id')
    .orderBy('bedhours.id', 'desc')
    .limit(1)

export const findBedtime = async (
  userId: Id,
  startDate: Date,
  endDate: Date
): Promise<Bedhour[]> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .whereBetween('bedtime', [startDate, endDate])
    .select('bedhours.id', 'bedtime')

export const findById = (userId: Id, id: Id): QueryBuilder<Bedhour> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .where({ 'bedhours.id': id })
    .first()
    .select('bedhours.id as id', 'bedtime', 'waketime', 'user_id as userId')

export const insert = (bedhour: {
  waketime: Date
  bedtime: Date
  userId: number | undefined
}): QueryBuilder<Bedhour> =>
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
): QueryBuilder<Bedhour> =>
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
