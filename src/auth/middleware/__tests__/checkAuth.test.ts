import { Request } from 'express'
import faker from 'faker'
import { UnauthorizedError } from '../../../server/middleware/errorHandler'
import { buildNext, MockResponse } from '../../../utils/test/generate'
import { ValidationError } from '../../../utils/validator'
import { generateToken } from '../../auth.controllers'
import checkAuth from '../checkAuth'

describe('checkAuth', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  } as MockResponse
  const next = buildNext()

  it('should call next if the request has a decodedJwt', () => {
    const req = {
      headers: {
        authorization: 'token',
      },
      decodedJwt: {
        subject: 1,
      },
    } as Request

    checkAuth(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should call next with an Unauthorized error if there is no decodedJwt and token cannot be verified', () => {
    const req = {
      headers: {
        authorization: 'faketoken',
      },
    } as Request

    checkAuth(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(new UnauthorizedError())
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should call next if there is no decodedJwt but the token can be verified', () => {
    const req = {
      headers: {
        authorization: generateToken(1, faker.internet.userName()),
      },
    } as Request

    checkAuth(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should call next with Validation error for missing token if there is no token', () => {
    const req = {
      headers: {},
    } as Request

    checkAuth(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(
      new ValidationError('Failed to authenticate', [
        'Missing authentication token',
      ])
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
