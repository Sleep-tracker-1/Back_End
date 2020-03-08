import Knex, { QueryBuilder } from 'knex'
import { add, format } from 'date-fns'
import getRandomNumber from '../../utils/randomNumberGenerator'

const generateTimestamps = (): {
  user_id: number
  bedtime: Date
  waketime: Date
}[][] => {
  return [...Array(56)].map((_id, userIndex) => {
    const startDate = new Date(2019, 2, 25, 19)

    return [...Array(66)].map((_days, dateIndex) => {
      const day = add(startDate, { days: dateIndex })
      const bedtime = add(day, {
        hours: getRandomNumber(24, 36),
        minutes: getRandomNumber(0, 60),
        seconds: getRandomNumber(0, 60),
      })
      const waketime = add(bedtime, {
        hours: getRandomNumber(4, 12),
        minutes: getRandomNumber(0, 60),
        seconds: getRandomNumber(0, 60),
      })

      return {
        user_id: userIndex + 1,
        bedtime,
        waketime,
      }
    })
  })
}

export const seed = (knex: Knex): QueryBuilder =>
  knex('bedhours').insert(generateTimestamps().flat())

export default seed
