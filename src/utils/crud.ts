/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { QueryBuilder } from 'knex'
import { DatabaseError } from '../server/middleware/errorHandler'

export type Id = number | string

type Model = {
  findAll: () => QueryBuilder<any[]>
  findById: (id: Id) => QueryBuilder<any>
  insert: (item: any) => Promise<[any]>
  update: (id: Id, item: any) => Promise<any>
  remove: (id: Id) => QueryBuilder<number>
}

export const getMany = (model: Model) => async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await model.findAll()
    res.status(200).json(items)
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve items',
        dbMessage: error,
      })
    )
  }
}

export const getOne = (model: Model) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await model.findById(req.params.id)
    res.status(200).json(item)
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}

export const createOne = (model: Model) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await model.insert(req.body)
    res.status(201).json(item)
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}

export const updateOne = (model: Model) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await model.update(req.params.id, req.body)
    res.status(200).json(updated)
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}

export const removeOne = (model: Model) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await model.remove(req.params.id)
    res.status(200).json({ message: `This item has been deleted` })
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve employees',
        dbMessage: error,
      })
    )
  }
}

type Controllers = {
  getMany: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getOne: (req: Request, res: Response, next: NextFunction) => Promise<void>
  createOne: (req: Request, res: Response, next: NextFunction) => Promise<void>
  updateOne: (req: Request, res: Response, next: NextFunction) => Promise<void>
  removeOne: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export default (model: Model): Controllers => ({
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  removeOne: removeOne(model),
})
