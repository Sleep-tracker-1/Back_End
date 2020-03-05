import { QueryBuilder } from 'knex'
import { add, sub } from 'date-fns'
import db from '../../data/dbConfig'
import { Id } from '../../utils/crud'

export type Mood = {
  id: Id
  wakeMood: number | null
  middayMood: number | null
  nightMood: number | null
  nightId: number
}

export const find = (
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[Mood]> =>
  db('mood')
    .join('bedhours', 'mood.night_id', 'bedhours.id')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .select(
      'mood.id as id',
      'mood.wake_mood as wakeMood',
      'mood.midday_mood as middayMood',
      'mood.night_mood as nightMood',
      'mood.night_id as nightId'
    )

export const findById = (id: Id): QueryBuilder<Mood> =>
  db('mood')
    .where({ id })
    .first()
    .select(
      'mood.id as id',
      'mood.wake_mood as wakeMood',
      'mood.midday_mood as middayMood',
      'mood.night_mood as nightMood',
      'mood.night_id as nightId'
    )

export const insert = (mood: Omit<Mood, 'id'>): QueryBuilder<[Mood]> =>
  db('mood').insert(
    {
      wake_mood: mood.wakeMood,
      midday_mood: mood.middayMood,
      night_mood: mood.nightMood,
      night_id: mood.nightId,
    },
    [
      'id',
      'wake_mood as wakeMood',
      'midday_mood as middayMood',
      'night_mood as nightMood',
      'night_id as nightId',
    ]
  )

export const update = (
  id: Id,
  mood: {
    wakeMood?: number | null
    middayMood?: number | null
    nightMood?: number | null
    nightId: Id
  }
): QueryBuilder<[Mood]> =>
  db('mood')
    .where({ night_id: Number(mood.nightId) })
    .update(
      {
        wake_mood: mood.wakeMood,
        midday_mood: mood.middayMood,
        night_mood: mood.nightMood,
        night_id: mood.nightId,
      },
      [
        'id',
        'wake_mood as wakeMood',
        'midday_mood as middayMood',
        'night_mood as nightMood',
        'night_id as nightId',
      ]
    )

export const remove = (id: Id): QueryBuilder<number> =>
  db('mood')
    .where({ id })
    .del()

export default { find, findById, insert, update, remove }
