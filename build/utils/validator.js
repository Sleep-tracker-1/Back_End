'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const validation_1 = tslib_1.__importDefault(require('folktale/validation'))
const { Success, Failure } = validation_1.default
exports.validator = (errorString, predicate) => o =>
  predicate(o) ? Success(o) : Failure([errorString])
exports.didItValidate = validationErrors =>
  validationErrors.matchWith({
    Success: () => true,
    Failure: () => false,
  })
class ValidationError extends Error {
  constructor(message, invalidations) {
    super()
    this.name = 'ValidationError'
    this.message = message
    this.invalidations = invalidations
    Error.call(this, message)
    Error.captureStackTrace(this, this.constructor)
  }
}
exports.ValidationError = ValidationError
