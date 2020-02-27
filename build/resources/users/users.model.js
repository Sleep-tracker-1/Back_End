'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const dbConfig_1 = tslib_1.__importDefault(require('../../data/dbConfig'))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.findBy = filter =>
  dbConfig_1
    .default('users')
    .select('*')
    .where(filter)
exports.findById = id =>
  dbConfig_1
    .default('users')
    .where({ id: Number(id) })
    .first()
exports.insert = user =>
  dbConfig_1.default('users').insert(user, ['id', 'username'])
exports.update = (id, user) =>
  dbConfig_1
    .default('users')
    .where({ id: Number(id) })
    .update(user, ['id', 'username'])
exports.remove = id =>
  dbConfig_1
    .default('users')
    .where('id', Number(id))
    .del()
exports.default = {
  findById: exports.findById,
  insert: exports.insert,
  update: exports.update,
  remove: exports.remove,
}
