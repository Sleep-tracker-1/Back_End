import { Request } from 'express'
import errorHandler, { DatabaseError, UnauthorizedError } from '../errorHandler'
import { buildNext, MockResponse } from '../../../test/utils/generate'
import { ValidationError } from '../../../utils/validator'

describe('errorHandler', () => {
  const req = {} as Request
  const next = buildNext()

  it('should call next with the error if headers have already been sent', () => {
    const error = new Error('blah')
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      headersSent: true,
    } as MockResponse

    errorHandler(error, req, res, next)
    expect(next).toHaveBeenCalledWith(error)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it("should send a 400 response if there's a validation error", () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    } as MockResponse
    const message = 'Fake Error Message'
    const invalidations = ['not real', 'test']
    const error = new ValidationError(message, invalidations)

    errorHandler(error, req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      message,
      errors: invalidations,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it("should send a 401 response if there's an authorization error", () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    } as MockResponse
    const message = 'Fake Error Message'

    const error = new UnauthorizedError({ message })

    errorHandler(error, req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      message,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it("should send a 500 response if there's database error", () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    } as MockResponse
    const message = 'Fake Error Message'

    const error = new DatabaseError({
      message,
      dbMessage: {
        errno: 2,
        code: '345',
        detail: 'errorrr',
      },
    })

    errorHandler(error, req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      name: error.name,
      message,
      dbMessage: error.dbMessage.detail,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should send a 500 response for any other error', () => {
    const originalError = console.error
    console.error = jest.fn()

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    } as MockResponse
    const message = 'Fake Error Message'

    const error = new Error(message)

    errorHandler(error, req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      name: error.name,
      message,
      stack: error.stack,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
    console.error = originalError
  })
})
