import request from 'supertest'
import server from '../../../server/server'
import db from '../../../data/dbConfig'

beforeEach(() =>
  db.raw('TRUNCATE TABLE "user", bedhours, mood, tiredness RESTART IDENTITY CASCADE')
)

describe('/data', () => {
  describe('getAllUserData', () => {
    const user = {
      username: 'Wes',
      password: 'password',
      firstName: 'Wes',
      email: 'fellerwestley@gmail.com',
    }

    it("should respond with a 200 code and all of the user's data from a specified time", () =>
      request(server)
        .post('/api/auth/register')
        .send(user)
        .then(response =>
          request(server)
            .get('/api/data')
            .set({ Authorization: response.body.token })
            .expect(200, {
              userId: 1,
              username: user.username,
              email: user.email,
              dates: [],
            })
        ))
  })
})
