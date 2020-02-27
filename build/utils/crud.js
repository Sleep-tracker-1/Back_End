'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const errorHandler_1 = require('../server/middleware/errorHandler')
exports.getMany = model => async (_req, res, next) => {
  try {
    const items = await model.findAll()
    res.status(200).json(items)
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Could not retrieve items',
        dbMessage: error,
      })
    )
  }
}
exports.getOne = model => async (req, res, next) => {
  try {
    const item = await model.findById(req.params.id)
    res.status(200).json(item)
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}
exports.createOne = model => async (req, res, next) => {
  try {
    const item = await model.insert(req.body)
    res.status(201).json(item)
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}
exports.updateOne = model => async (req, res, next) => {
  try {
    const updated = await model.update(req.params.id, req.body)
    res.status(200).json(updated)
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}
exports.removeOne = model => async (req, res, next) => {
  try {
    await model.remove(req.params.id)
    res.status(200).json({ message: `This item has been deleted` })
  } catch (error) {
    next(
      new errorHandler_1.DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}
exports.default = model => ({
  getMany: exports.getMany(model),
  getOne: exports.getOne(model),
  createOne: exports.createOne(model),
  updateOne: exports.updateOne(model),
  removeOne: exports.removeOne(model),
})
