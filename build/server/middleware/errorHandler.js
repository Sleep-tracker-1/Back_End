'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const validator_1 = require('../../utils/validator')
class UnauthorizedError extends Error {
  constructor(error) {
    super()
    this.name = 'UnauthorizedError'
    this.message = error.message
    Error.call(this, error.message)
    Error.captureStackTrace(this, this.constructor)
  }
}
exports.UnauthorizedError = UnauthorizedError
class DatabaseError extends Error {
  constructor(error) {
    super()
    this.name = 'DatabaseError'
    this.message = error.message
    this.dbMessage = error.dbMessage
    Error.call(this, error.message)
    Error.captureStackTrace(this, this.constructor)
  }
}
exports.DatabaseError = DatabaseError
const errorHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error)
  } else if (error instanceof validator_1.ValidationError) {
    res
      .status(400)
      .json({ message: error.message, errors: error.invalidations })
  } else if (error instanceof UnauthorizedError) {
    res
      .status(401)
      .json({ message: 'You are not authorized to access this endpoint' })
  } else if (error instanceof DatabaseError) {
    res.status(500).json({
      name: error.name,
      message: error.message,
      dbMessage: error.dbMessage,
    })
  } else {
    console.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    res
      .status(500)
      .json(
        Object.assign(
          { name: error.name, message: error.message },
          process.env.NODE_ENV !== 'production' && { stack: error.stack }
        )
      )
  }
}
exports.default = errorHandler
