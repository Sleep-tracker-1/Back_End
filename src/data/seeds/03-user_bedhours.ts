import Knex, { QueryBuilder } from 'knex'

const generateUserBedhours = (): { user_id: number; bedhours_id: number }[][] =>
  [...Array(56)].map((_id, userIndex) =>
    [...Array(66)].map((_days, dateIndex) => {
      return {
        user_id: userIndex + 1,
        bedhours_id: dateIndex + 1,
      }
    })
  )

export const seed = (knex: Knex): QueryBuilder =>
  knex('user_bedhours').insert(generateUserBedhours().flat())

export default seed
