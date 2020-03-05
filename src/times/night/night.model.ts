import { QueryBuilder } from 'knex'
import { Mood } from '../../resources/moods/moods.model'
import { Bedhour } from '../../resources/bedhours/bedhours.model'
import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'

type Night = {
  time: Date
  mood: number
  tiredness: number
}

const insertTime = (time: Night['time'], userId: Id): QueryBuilder<[Bedhour]> =>
  db('bedhours').insert(
    {
      bedtime: time,
      waketime: null,
      user_id: userId,
    },
    ['id', 'bedtime', 'user_id as userId']
  )

const insertMood = (
  mood: Night['mood'],
  nightId: number
): QueryBuilder<[Mood]> =>
  db('mood').insert(
    {
      night_mood: mood,
      night_id: nightId,
      wake_mood: null,
      midday_mood: null,
    },
    ['id', 'night_mood as nightMood', 'night_id as nightId']
  )

const insertTiredness = (
  tired: Night['tiredness'],
  nightId: number
): QueryBuilder<[Mood]> =>
  db('tiredness').insert(
    {
      night_tired: tired,
      night_id: nightId,
      wake_tired: null,
      midday_tired: null,
    },
    ['id', 'night_tired as nightTired', 'night_id as nightId']
  )

export default { insertTime, insertMood, insertTiredness }
