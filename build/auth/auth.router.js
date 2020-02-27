'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const express_1 = require('express')
const validation_1 = tslib_1.__importDefault(require('./middleware/validation'))
const auth_controllers_1 = tslib_1.__importDefault(
  require('./auth.controllers')
)
const router = express_1.Router()
router
  .route('/register')
  .post(validation_1.default, auth_controllers_1.default.register)
router
  .route('/login')
  .post(validation_1.default, auth_controllers_1.default.login)
exports.default = router
