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
  id: Id,
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[Mood]> =>
  db('mood')
    .join('bedhours', 'mood.night_id', 'bedhours.id')
    .whereBetween('waketime', [startDate, add(endDate, { days: 1 })])
    .andWhere({ id })
    .select(
      'mood.id as id',
      'mood.wake_mood as wakeMood',
      'mood.midday_mood as middayMood',
      'mood.night_mood as nightMood',
      'mood.night_id as nightId'
    )

export const findById = (userId: Id, nightId: Id): QueryBuilder<Mood> =>
  db('user')
    .where({ user_id: userId })
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .where({ 'bedhours.id': nightId })
    .join('mood', 'mood.night_id', 'bedhours.id')
    .first()
    .select(
      'mood.id as id',
      'mood.wake_mood as wakeMood',
      'mood.midday_mood as middayMood',
      'mood.night_mood as nightMood',
      'mood.night_id as nightId'
    )

export const insert = (mood: Omit<Mood, 'id'>): QueryBuilder<Mood> =>
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
  nightId: Id,
  mood: {
    wakeMood?: number | null
    middayMood?: number | null
    nightMood?: number | null
  }
): QueryBuilder<Mood> =>
  db('mood')
    .where({ night_id: Number(nightId) })
    .update(
      {
        wake_mood: mood.wakeMood,
        midday_mood: mood.middayMood,
        night_mood: mood.nightMood,
      },
      [
        'mood.id as moodId',
        'wake_mood as wakeMood',
        'midday_mood as middayMood',
        'night_mood as nightMood',
        'night_id as nightId',
      ]
    )

export const remove = (nightId: Id): QueryBuilder<number> =>
  db('mood')
    .where({ night_id: Number(nightId) })
    .update({
      wake_mood: null,
      midday_mood: null,
      night_mood: null,
    })

export default { find, findById, insert, update, remove }
