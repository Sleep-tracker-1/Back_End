import { Request } from 'express'
import faker from 'faker'
import {
  hasBody,
  hasEmail,
  hasFirstName,
  hasPassword,
  hasUsername,
  loginValidationResult,
  passwordMinLength,
  registerValidationResult,
  checkValidation,
} from '../validation'
import { buildNext, MockResponse } from '../../../utils/test/generate'
import { AuthorizationRequest } from '../checkAuth'
import { ValidationError } from '../../../utils/validator'

describe('request checkers', () => {
  describe('hasBody', () => {
    it('should return false if there is no request body', () => {
      expect(hasBody({} as Request)).toBe(false)
      expect(hasBody({ body: {} } as Request)).toBe(true)
    })
  })

  describe('hasUsername', () => {
    it('should return false if there is no username', () => {
      expect(hasUsername({ body: {} } as Request)).toBe(false)
      expect(
        hasUsername({
          body: { username: faker.internet.userName() },
        } as Request)
      ).toBe(true)
    })
  })

  describe('hasPassword', () => {
    it('should return false if there is no password', () => {
      expect(hasPassword({ body: {} } as Request)).toBe(false)
      expect(
        hasPassword({
          body: { password: faker.internet.password() },
        } as Request)
      ).toBe(true)
    })
  })

  describe('passwordMinLength', () => {
    it('should return false if password is too short', () => {
      expect(
        passwordMinLength({
          body: { password: faker.internet.password(2) },
        } as Request)
      ).toBe(false)
      expect(
        passwordMinLength({
          body: { password: faker.internet.password(6) },
        } as Request)
      ).toBe(true)
    })
  })

  describe('hasFirstName', () => {
    it('should return false if there is no firstName', () => {
      expect(hasFirstName({ body: {} } as Request)).toBe(false)
      expect(
        hasFirstName({ body: { firstName: faker.name.firstName() } } as Request)
      ).toBe(true)
    })
  })

  describe('hasEmail', () => {
    it('should return false if there is no email', () => {
      expect(hasEmail({ body: {} } as Request)).toBe(false)
      expect(
        hasEmail({ body: { email: faker.internet.email() } } as Request)
      ).toBe(true)
    })
  })
})

describe('error message constructors', () => {
  describe('registerValidationResult', () => {
    it('should return error messages for different missing request properties', () => {
      expect(registerValidationResult({ body: {} } as Request)).toMatchObject({
        value: [
          'Missing username',
          'Missing password',
          'Missing first name',
          'Missing email',
          'Password must be at least 6 characters',
        ],
      })
      expect(
        registerValidationResult({
          body: { username: faker.internet.userName() },
        } as Request)
      ).toMatchObject({
        value: [
          'Missing password',
          'Missing first name',
          'Missing email',
          'Password must be at least 6 characters',
        ],
      })
      expect(
        registerValidationResult({
          body: {
            username: faker.internet.userName(),
            password: faker.internet.password(2),
          },
        } as Request)
      ).toMatchObject({
        value: [
          'Missing first name',
          'Missing email',
          'Password must be at least 6 characters',
        ],
      })
      expect(
        registerValidationResult({
          body: {
            username: faker.internet.userName(),
            password: faker.internet.password(6),
          },
        } as Request)
      ).toMatchObject({
        value: ['Missing first name', 'Missing email'],
      })
      expect(
        registerValidationResult({
          body: {
            username: faker.internet.userName(),
            password: faker.internet.password(6),
            firstName: faker.name.firstName(),
          },
        } as Request)
      ).toMatchObject({
        value: ['Missing email'],
      })

      const username = faker.internet.userName()
      const password = faker.internet.password(6)
      const firstName = faker.name.firstName()
      const email = faker.internet.email()

      expect(
        registerValidationResult({
          body: {
            username,
            password,
            firstName,
            email,
          },
        } as Request)
      ).toMatchObject({
        value: {
          body: {
            username,
            password,
            firstName,
            email,
          },
        },
      })
    })
  })

  describe('loginValidationResult', () => {
    it('should return error messages for different missing request properties', () => {
      expect(loginValidationResult({ body: {} } as Request)).toMatchObject({
        value: ['Missing username', 'Missing password'],
      })
      expect(
        loginValidationResult({
          body: { username: faker.internet.userName() },
        } as Request)
      ).toMatchObject({
        value: ['Missing password'],
      })

      const username = faker.internet.userName()
      const password = faker.internet.password(6)

      expect(
        loginValidationResult({
          body: {
            username,
            password,
          },
        } as Request)
      ).toMatchObject({
        value: {
          body: {
            username,
            password,
          },
        },
      })
    })
  })
})

describe('checkValidation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  } as MockResponse
  const next = buildNext()

  it('should call the next function if /api/auth/register is called with a valid request', () => {
    const req = {
      path: '/api/auth/register',
      body: {
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      },
    } as AuthorizationRequest

    checkValidation(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should call the next function with a validation error if /api/auth/register is called with an invalid request', () => {
    const req = {
      path: '/api/auth/register',
      body: {},
    } as AuthorizationRequest

    checkValidation(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(
      new ValidationError('Submitted data is incomplete or incorrect', [
        'Missing username',
        'Missing password',
        'Missing first name',
        'Missing email',
        'Password must be at least 6 characters',
      ])
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should call the next function if /api/auth/login is called with a valid request', () => {
    checkValidation(
      {
        path: '/api/auth/login',
        body: {
          username: faker.internet.userName(),
          password: faker.internet.password(6),
        },
      } as Request,
      res,
      next
    )

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should call the next function with a validation error if /api/auth/login is called with an invalid request', () => {
    const req = {
      path: '/api/auth/login',
      body: {},
    } as AuthorizationRequest

    checkValidation(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(
      new ValidationError('Submitted data is incomplete or incorrect', [
        'Missing username',
        'Missing password',
      ])
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
