import request from 'supertest'
import faker from 'faker'
import { Request } from 'express'
import server from '../../../server/server'
import db from '../../../data/dbConfig'
import controllers from '../users.controllers'
import { buildNext, MockResponse } from '../../../utils/test/generate'
import {
  DatabaseError,
  UnauthorizedError,
} from '../../../server/middleware/errorHandler'

describe('/user', () => {
  beforeEach(() => db.raw('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE'))

  describe('getUser', () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(6),
      firstName: faker.name.firstName(),
      email: faker.internet.email(),
    }

    it("should respond with a 200 code and the user's info without password", () =>
      request(server)
        .post('/api/auth/register')
        .send(user)
        .then(response =>
          request(server)
            .get('/api/user')
            .set({ Authorization: response.body.token })
            .expect(200, {
              id: 1,
              username: user.username,
              firstName: user.firstName,
              email: user.email,
            })
        ))

    it("should return a 500 database error if user can't be retrieved", () => {
      const req = {
        body: {},
      } as Request
      const next = buildNext()
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      } as MockResponse
      const error = new UnauthorizedError()

      return request(server)
        .post('/api/auth/register')
        .send(user)
        .then(async () => {
          await controllers.getUser(req, res, next)
          expect(next).toHaveBeenCalledTimes(1)
          expect(next).toHaveBeenCalledWith(error)
          expect(res.status).not.toHaveBeenCalled()
          expect(res.json).not.toHaveBeenCalled()
        })
    })
  })
})
