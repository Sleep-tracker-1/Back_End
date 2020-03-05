import { QueryBuilder } from 'knex'
import { Bedhour } from '../../resources/bedhours/bedhours.model'
import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'
import { Night } from '../night/night.model'
import { Tired } from '../../resources/tiredness/tiredness.model'
import { Mood } from '../../resources/moods/moods.model'

export type Wake = {
  time: Date
  mood: number
  tiredness: number
}

const updateTime = (
  id: Id,
  waketime: Wake['time'],
  bedtime: Night['time'],
  userId: Id
): QueryBuilder<[Bedhour]> =>
  db('bedhours')
    .where({ id: Number(id) })
    .update(
      {
        bedtime,
        waketime,
        user_id: userId,
      },
      ['id', 'bedtime', 'waketime', 'user_id as userId']
    )

const updateMood = async (nightId: Id, wakeMood: number): Promise<Mood> =>
  db('mood')
    .where({ night_id: Number(nightId) })
    .update(
      {
        wake_mood: wakeMood,
        midday_mood: null,
        night_id: nightId,
      },
      [
        'id',
        'wake_mood as wakeMood',
        'midday_mood as middayMood',
        'night_mood as nightMood',
        'night_id as nightId',
      ]
    )

const updateTiredness = async (
  nightId: Id,
  wakeTired: number
): Promise<Tired> =>
  db('tiredness')
    .where({ night_id: nightId })
    .update(
      {
        wake_tired: wakeTired,
        midday_tired: null,
        night_id: nightId,
      },
      [
        'id',
        'wake_tired as wakeTired',
        'midday_tired as middayTired',
        'night_tired as nightTired',
        'night_id as nightId',
      ]
    )

export default {
  updateTime,
  updateMood,
  updateTiredness,
}
