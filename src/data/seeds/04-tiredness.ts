import Knex from 'knex'
import getRandomNumber from '../../utils/randomNumberGenerator'
import { getNights } from './03-mood'

const generateTiredness = (
  nights
): Promise<{
  night_id: number
  wake_tired: number
  midday_tired: number
  night_tired: number
}[]> =>
  nights.map(night => {
    return {
      night_id: night.id,
      wake_tired: getRandomNumber(1, 4),
      midday_tired: getRandomNumber(1, 4),
      night_tired: getRandomNumber(1, 4),
    }
  })

export const seed = async (knex: Knex): Promise<void> => {
  const nights = await getNights(knex)
  return knex('tiredness').insert(generateTiredness(nights))
}

export default seed
