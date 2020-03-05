import { QueryBuilder } from 'knex'
import { add, sub } from 'date-fns'
import db from '../../data/dbConfig'
import { Id } from '../../utils/crud'

type Tired = {
  id: Id
  wakeTired: number | null
  middayTired: number | null
  nightTired: number | null
  nightId: number
}

export const find = (
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[Tired]> =>
  db('tiredness')
    .join('bedhours', 'tiredness.night_id', 'bedhours.id')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .select(
      'tiredness.id as id',
      'tiredness.wake_tired as wakeTired',
      'tiredness.midday_tired as middayTired',
      'tiredness.night_tired as nightTired',
      'tiredness.night_id as nightId'
    )

export const findById = (id: Id): QueryBuilder<Tired> =>
  db('tiredness')
    .where({ id })
    .first()
    .select(
      'tiredness.id as id',
      'tiredness.wake_tired as wakeTired',
      'tiredness.midday_tired as middayTired',
      'tiredness.night_tired as nightTired',
      'tiredness.night_id as nightId'
    )

export const insert = (tired: Omit<Tired, 'id'>): QueryBuilder<[Tired]> =>
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
  id: Id,
  tired: Omit<Tired, 'id'>
): QueryBuilder<[Tired]> =>
  db('tiredness')
    .where({ night_id: tired.nightId })
    .update(
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

export const remove = (id: Id): QueryBuilder<number> =>
  db('tiredness')
    .where({ id })
    .del()

export default { find, findById, insert, update, remove }
