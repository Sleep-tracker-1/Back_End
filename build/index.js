'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const dotenv_1 = require('dotenv')
const server_1 = tslib_1.__importDefault(require('./server/server'))
dotenv_1.config()
const PORT = process.env.PORT || 4000
server_1.default.listen(PORT, () =>
  console.info(`***Listening on port ${PORT}***`)
)
