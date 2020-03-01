/* eslint-disable max-classes-per-file */
import { Request, Response, NextFunction } from 'express'

import { ValidationError } from '../../utils/validator'

export class UnauthorizedError extends Error {
  constructor(error = { message: 'Invalid credentials' }) {
    super()
    this.name = 'UnauthorizedError'
    this.message = error.message
    Error.call(this, error.message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseError extends Error {
  dbMessage: {
    errno: number
    code: string
    detail: string
  }

  constructor(error: {
    message: string
    dbMessage: { errno: number; code: string; detail: string }
  }) {
    super()
    this.name = 'DatabaseError'
    this.message = error.message
    this.dbMessage = error.dbMessage
    Error.call(this, error.message)
    Error.captureStackTrace(this, this.constructor)
  }
}

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(error)
  } else if (error instanceof ValidationError) {
    res
      .status(400)
      .json({ message: error.message, errors: error.invalidations })
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ message: error.message })
  } else if (error instanceof DatabaseError) {
    res.status(500).json({
      name: error.name,
      message: error.message,
      dbMessage: error.dbMessage.detail,
    })
  } else {
    console.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    res.status(500).json({
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    })
  }
}

export default errorHandler
