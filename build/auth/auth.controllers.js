'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const bcrypt_1 = tslib_1.__importDefault(require('bcrypt'))
const jsonwebtoken_1 = tslib_1.__importDefault(require('jsonwebtoken'))
const users_model_1 = require('../resources/users/users.model')
const errorHandler_1 = require('../server/middleware/errorHandler')
const secrets_1 = tslib_1.__importDefault(require('../secrets'))
const generateToken = ({ id, username }) =>
  jsonwebtoken_1.default.sign(
    {
      subject: id,
      username,
    },
    secrets_1.default,
    {
      expiresIn: '1d',
    }
  )
const register = async (req, res, next) => {
  const user = req.body
  const hash = bcrypt_1.default.hashSync(user.password, 10)
  const hashedUser = Object.assign(Object.assign({}, user), { password: hash })
  try {
    const registeredUser = await users_model_1.insert(hashedUser)
    res.status(201).json({
      user: registeredUser.data,
      token: generateToken(registeredUser.data),
    })
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Registration failed',
        dbMessage: error,
      })
    )
  }
}
const login = async (req, res, next) => {
  const { username, password } = req.body
  try {
    const userToLogin = await users_model_1.findBy({ username }).first()
    if (
      userToLogin &&
      bcrypt_1.default.compareSync(password, userToLogin.password)
    ) {
      res.status(200).json({
        message: `Welcome ${username}!`,
        token: generateToken(userToLogin),
      })
    } else {
      next(
        new errorHandler_1.UnauthorizedError({ message: 'You shall not pass!' })
      )
    }
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Login failed',
        dbMessage: error,
      })
    )
  }
}
exports.default = {
  register,
  login,
}
