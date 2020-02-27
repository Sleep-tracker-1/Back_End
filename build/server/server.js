'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const express_1 = tslib_1.__importStar(require('express'))
const helmet_1 = tslib_1.__importDefault(require('helmet'))
const morgan_1 = tslib_1.__importDefault(require('morgan'))
const cors_1 = tslib_1.__importDefault(require('cors'))
const errorHandler_1 = tslib_1.__importDefault(
  require('./middleware/errorHandler')
)
const api_router_1 = tslib_1.__importDefault(require('../api/api.router'))
// import swaggerDocument from '../openapi.json'
const server = express_1.default()
server.use(
  helmet_1.default(),
  morgan_1.default('dev'),
  express_1.json(),
  cors_1.default()
)
// server.use('/docs', serve, setup(swaggerDocument))
server.use('/api', api_router_1.default)
server.use(errorHandler_1.default)
exports.default = server
