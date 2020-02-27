'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const jsonwebtoken_1 = tslib_1.__importDefault(require('jsonwebtoken'))
const errorHandler_1 = require('../../server/middleware/errorHandler')
const validator_1 = require('../../utils/validator')
const secrets_1 = tslib_1.__importDefault(require('../../secrets'))
const checkAuth = (req, _res, next) => {
  const token = req.headers.authorization
  if (req.decodedJwt) {
    next()
  } else if (token) {
    jsonwebtoken_1.default.verify(
      token,
      secrets_1.default,
      (error, decodedJwt) => {
        if (error) {
          next(
            new errorHandler_1.UnauthorizedError({
              message: 'You shall not pass!',
            })
          )
        } else {
          req.decodedJwt = decodedJwt
          next()
        }
      }
    )
  } else {
    next(
      new validator_1.ValidationError('Failed to authenticate', [
        'Missing authentication token',
      ])
    )
  }
}
exports.default = checkAuth
