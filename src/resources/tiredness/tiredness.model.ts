import { QueryBuilder } from 'knex'
import { add, sub } from 'date-fns'
import db from '../../data/dbConfig'
import { Id } from '../../utils/crud'

export type Tired = {
  id: Id
  wakeTired: number | null
  middayTired: number | null
  nightTired: number | null
  nightId: number
}

export const find = (
  userId: Id,
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[Tired]> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .join('tiredness', 'tiredness.night_id', 'bedhours.id')
    .select(
      'tiredness.id as id',
      'tiredness.wake_tired as wakeTired',
      'tiredness.midday_tired as middayTired',
      'tiredness.night_tired as nightTired',
      'tiredness.night_id as nightId'
    )

export const findById = (userId: Id, nightId: Id): QueryBuilder<Tired> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .where({ 'bedhours.id': nightId })
    .join('tiredness', 'tiredness.night_id', 'bedhours.id')
    .first()
    .select(
      'tiredness.id as id',
      'tiredness.wake_tired as wakeTired',
      'tiredness.midday_tired as middayTired',
      'tiredness.night_tired as nightTired',
      'tiredness.night_id as nightId'
    )

export const insert = (tired: Omit<Tired, 'id'>): QueryBuilder<Tired> =>
  db('tiredness').insert(
    {
      wake_tired: tired.wakeTired,
      midday_tired: tired.middayTired,
      night_tired: tired.nightTired,
      night_id: tired.nightId,
    },
    [
      'id',
      'wake_tired as wakeTired',
      'midday_tired as middayTired',
      'night_tired as nightTired',
      'night_id as nightId',
    ]
  )

export const update = (
  nightId: Id,
  tired: {
    wakeTired?: number | null
    middayTired?: number | null
    nightTired?: number | null
  }
): QueryBuilder<Tired> =>
  db('tiredness')
    .where({ night_id: Number(nightId) })
    .update(
      {
        wake_tired: tired.wakeTired,
        midday_tired: tired.middayTired,
        night_tired: tired.nightTired,
      },
      [
        'tiredness.id as tirednessId',
        'wake_tired as wakeTired',
        'midday_tired as middayTired',
        'night_tired as nightTired',
        'night_id as nightId',
      ]
    )

export const remove = (nightId: Id): QueryBuilder<number> =>
  db('tiredness')
    .where({ night_id: Number(nightId) })
    .update({
      wake_tired: null,
      midday_tired: null,
      night_tired: null,
    })

export default { find, findById, insert, update, remove }
