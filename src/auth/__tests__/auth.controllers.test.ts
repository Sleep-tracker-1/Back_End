import request from 'supertest'
import faker from 'faker'
import { Request } from 'express'
import server from '../../server/server'
import db from '../../data/dbConfig'
import { generateToken, login } from '../auth.controllers'
import { DatabaseError } from '../../server/middleware/errorHandler'
import { buildNext, MockResponse } from '../../test/utils/generate'

describe('/auth', () => {
  beforeEach(() => db.raw('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE'))

  describe('register a new user', () => {
    it('should return a 201 status code when a user is registered', () => {
      const newUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      }

      return request(server)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201, {
          userInfo: {
            id: 1,
            username: newUser.username,
            firstName: newUser.firstName,
            email: newUser.email,
          },
          token: generateToken(1, newUser.username),
        })
    })

    it('should call next with a database error if user cannot be registered', () => {
      const newUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      }

      return request(server)
        .post('/api/auth/register')
        .send(newUser)
        .then(() => {
          return request(server)
            .post('/api/auth/register')
            .send(newUser)
            .expect(500, {
              name: 'DatabaseError',
              message: 'Registration failed',
              dbMessage: `Key (username)=(${newUser.username}) already exists.`,
            })
        })
    })
  })

  describe('exising user login', () => {
    it('should return a 200 status on successful login', () => {
      const newUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      }

      return request(server)
        .post('/api/auth/register')
        .send({
          username: newUser.username,
          password: newUser.password,
          firstName: newUser.firstName,
          email: newUser.email,
        })
        .then(() => {
          return request(server)
            .post('/api/auth/login')
            .send({ username: newUser.username, password: newUser.password })
            .expect(200, {
              message: `Welcome ${newUser.firstName}!`,
              token: generateToken(1, newUser.username),
            })
        })
    })

    it('should return a token on successful login', () => {
      const newUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      }

      return request(server)
        .post('/api/auth/register')
        .send({
          username: newUser.username,
          password: newUser.password,
          firstName: newUser.firstName,
          email: newUser.email,
        })
        .then(() => {
          return request(server)
            .post('/api/auth/login')
            .send({ username: newUser.username, password: newUser.password })
            .expect(200, {
              message: `Welcome ${newUser.firstName}!`,
              token: generateToken(1, newUser.username),
            })
        })
    })

    it('should call next with an authorization error if user enters incorrect password', () => {
      const newUser = {
        username: faker.internet.userName(),
        password: 'correctPassword',
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      }

      return request(server)
        .post('/api/auth/register')
        .send(newUser)
        .then(() => {
          return request(server)
            .post('/api/auth/login')
            .send({ username: newUser.username, password: 'incorrectPassword' })
            .expect(401, { message: 'Invalid credentials' })
        })
    })

    it('should call next with a database error if user cannot be login', () => {
      const req = {
        body: {},
      } as Request
      const next = buildNext()
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      } as MockResponse
      const error = new DatabaseError({
        message: 'Login failed',
        dbMessage: {
          errno: 2,
          code: '345',
          detail: 'errorrr',
        },
      })

      const newUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      }

      return request(server)
        .post('/api/auth/register')
        .send(newUser)
        .then(async () => {
          await login(req, res, next)
          expect(next).toHaveBeenCalledTimes(1)
          expect(next).toHaveBeenCalledWith(error)
          expect(res.status).not.toHaveBeenCalled()
          expect(res.json).not.toHaveBeenCalled()
        })
    })
  })
})
