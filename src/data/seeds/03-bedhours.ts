import Knex, { QueryBuilder } from 'knex'
import { add } from 'date-fns'

const generateTimestamps = (): {
  user_id: number
  bedtime: Date
  waketime: Date
}[][] => {
  return [...Array(458)].map((_id, userIndex) => {
    const startDate = new Date(2019, 2, 25, 19)

    return [...Array(365)].map((_days, dateIndex) => {
      const day = add(startDate, { days: dateIndex })
      const bedtime = add(day, {
        hours: Math.floor(Math.random() * 7),
        minutes: Math.random() * 60,
        seconds: Math.random() * 60,
      })
      const waketime = add(bedtime, { hours: Math.random() * (12 - 4) + 4 })

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
