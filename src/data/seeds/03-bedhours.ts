import Knex, { QueryBuilder } from 'knex'
import { add } from 'date-fns'

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

const generateTimestamps = (): {
  user_id: number
  bedtime: Date
  waketime: Date
}[][] => {
  return [...Array(50)].map((_id, userIndex) => {
    const startDate = new Date(2019, 2, 25, 19)

    return [...Array(365)].map((_days, dateIndex) => {
      const day = add(startDate, { days: dateIndex })
      const bedtime = add(day, {
        hours: getRandomNumber(0, 7),
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

exports.seed = (knex: Knex): QueryBuilder =>
  knex('bedhours').insert(generateTimestamps().flat())
