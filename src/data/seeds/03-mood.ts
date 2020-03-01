import Knex, { QueryBuilder } from 'knex'
import getRandomNumber from '../../utils/randomNumberGenerator'

export const getNights = (knex: Knex): QueryBuilder<{ id: number }[]> =>
  knex('bedhours').select('id')

const generateMoods = (
  nights: {
    id: number
    night_id: number
    wake_mood: number
    midday_mood: number
    night_mood: number
  }[]
): {
  night_id: number
  wake_mood: number
  midday_mood: number
  night_mood: number
}[] =>
  nights.map(night => {
    return {
      night_id: night.id,
      wake_mood: getRandomNumber(1, 4),
      midday_mood: getRandomNumber(1, 4),
      night_mood: getRandomNumber(1, 4),
    }
  })

export const seed = async (knex: Knex): Promise<void> => {
  const nights = await getNights(knex)
  return knex('mood').insert(generateMoods(nights))
}
export default seed
