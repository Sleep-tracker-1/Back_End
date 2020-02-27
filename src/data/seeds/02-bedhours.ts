import Knex, { QueryBuilder } from 'knex'
import { add } from 'date-fns'

const generateTimestamps = () => {
  return [...Array(7)].map((_id, userIndex) => {
    const startDate = new Date(
      2019,
      2,
      25,
      Math.floor(Math.random() * 23) + 18,
      Math.random() * 60,
      Math.random() * 60
    )

    return [...Array(365)].map((_days, dateIndex) => {
      const bedtime = add(startDate, { days: dateIndex })
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
  knex('bedhours').insert(generateTimestamps())
