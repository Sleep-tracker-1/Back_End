import { Tired } from '../../resources/tiredness/tiredness.model'
import { Id } from '../../utils/crud'
import db from '../../data/dbConfig'
import { Mood } from '../../resources/moods/moods.model'

const updateMood = async (nightId: Id, middayMood: number): Promise<Mood> =>
  db('mood')
    .where({ night_id: Number(nightId) })
    .update(
      {
        midday_mood: middayMood,
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
  middayTired: number
): Promise<Tired> =>
  db('tiredness')
    .where({ night_id: nightId })
    .update(
      {
        midday_tired: middayTired,
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
  updateMood,
  updateTiredness,
}
