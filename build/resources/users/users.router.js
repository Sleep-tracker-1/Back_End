'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const express_1 = require('express')
const users_controllers_1 = tslib_1.__importDefault(
  require('./users.controllers')
)
const checkAuth_1 = tslib_1.__importDefault(
  require('../../auth/middleware/checkAuth')
)
const router = express_1.Router()
router.route('/').get(checkAuth_1.default, users_controllers_1.default)
exports.default = router
