'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const users_model_1 = require('./users.model')
const errorHandler_1 = require('../../server/middleware/errorHandler')
const getUsers = async (req, res, next) => {
  try {
    // Don't want to ever respond with the user's password
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const _a = await users_model_1.findById(req.decodedJwt.subject),
      { password } = _a,
      user = tslib_1.__rest(_a, ['password'])
    res.status(200).json(user)
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Could not retrieve user',
        dbMessage: error,
      })
    )
  }
}
exports.default = getUsers
