'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const express_1 = require('express')
const api_controllers_1 = tslib_1.__importDefault(require('./api.controllers'))
const auth_router_1 = tslib_1.__importDefault(require('../auth/auth.router'))
const users_router_1 = tslib_1.__importDefault(
  require('../resources/users/users.router')
)
const router = express_1.Router()
router.use('/auth', auth_router_1.default)
router.use('/users', users_router_1.default)
router.route('/').get(api_controllers_1.default.apiRoot)
exports.default = router
