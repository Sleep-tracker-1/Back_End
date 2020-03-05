import request from 'supertest'
import faker from 'faker'
import server from '../../../server/server'
import db from '../../../data/dbConfig'
import { buildBedhour } from '../../../utils/test/generate'

beforeEach(() =>
  db.raw('TRUNCATE TABLE "user", "bedhours" RESTART IDENTITY CASCADE')
)

describe('bedhours', () => {
  describe('addBedHours', () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(6),
      firstName: faker.name.firstName(),
      email: faker.internet.email(),
    }

    const bedHours1 = buildBedhour(
      {
        year: 2020,
        month: 1,
        date: 27,
        hours: 21,
        minutes: 17,
        seconds: 19,
      },
      { hours: 9, minutes: 2, seconds: 1 }
    )

    const bedHours2 = buildBedhour(
      {
        year: 2020,
        month: 3,
        date: 27,
        hours: 21,
        minutes: 17,
        seconds: 19,
      },
      { hours: 9, minutes: 2, seconds: 1 }
    )

    it('should respond with a 201 code and set of sleep records when a bedhours record is posted ', () =>
      request(server)
        .post('/api/auth/register')
        .send(user)
        .then(response =>
          request(server)
            .post('/api/bedhours')
            .set({ Authorization: response.body.token })
            .send(bedHours1)
            .expect(201, {
              id: 1,
              bedtime: bedHours1.bedtime.toISOString(),
              waketime: bedHours1.waketime.toISOString(),
              userId: 1,
            })
        ))

    it('should respond with a 401 code if user is not authorized', () =>
      request(server)
        .post('/api/auth/register')
        .send(user)
        .then(() =>
          request(server)
            .post('/api/bedhours')
            .send(bedHours1)
            .expect(401, { message: 'Failed to authenticate' })
        ))

    it('should call next with a validation error if a request is incomplete', () =>
      request(server)
        .post('/api/auth/register')
        .send(user)
        .then(response =>
          request(server)
            .post('/api/bedhours')
            .set({ Authorization: response.body.token })
            .send({ bedtime: bedHours1.bedtime })
            .expect(400, {
              message: 'Submitted data is incomplete or incorrect',
              errors: ['Missing waketime'],
            })
        ))
  })
})
