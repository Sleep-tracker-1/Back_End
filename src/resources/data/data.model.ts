import { QueryBuilder } from 'knex'
import { sub } from 'date-fns'
import db from '../../data/dbConfig'

export type SleepData = {
  date: Date
  dateId: number
  waketime: Date
  wakeMood: number
  wakeTired: number
  middayMood: number
  middayTired: number
  bedtime: Date
  nightMood: number
  nightTired: number
}

export const getAllData = (
  userId: number,
  startDate: Date = sub(new Date(), { days: 30 }),
  endDate: Date = new Date()
): QueryBuilder<[SleepData]> =>
  db('user')
    .where('user.id', userId)
    .join('bedhours', 'user.id', 'bedhours.user_id')
    .whereBetween('bedhours.waketime', [startDate, endDate])
    .join('mood', 'mood.night_id', 'bedhours.id')
    .join('tiredness', 'tiredness.night_id', 'bedhours.id')
    .select(
      'bedhours.id as dateId',
      'bedhours.waketime',
      'mood.wake_mood as wakeMood',
      'tiredness.wake_tired as wakeTired',
      'mood.midday_mood as middayMood',
      'tiredness.midday_tired as middayTired',
      'bedhours.bedtime',
      'mood.night_mood as nightMood',
      'tiredness.night_tired as nightTired'
    )
    .orderBy('bedhours.waketime')

export default { getAllData }
