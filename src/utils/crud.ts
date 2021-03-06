/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { QueryBuilder } from 'knex'
import {
  DatabaseError,
  UnauthorizedError,
} from '../server/middleware/errorHandler'

export type Id = number | string | undefined

type Model = {
  find: (userId: Id, startDate?: Date, endDate?: Date) => QueryBuilder
  findById: (userId: Id, nightId: Id) => QueryBuilder<any>
  insert: (item: any) => QueryBuilder<any>
  update: (nightId: Id, item: any, userId?: Id) => QueryBuilder<any>
  remove: (nightId: Id) => QueryBuilder<number>
}

export const getMany = (model: Model) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.decodedJwt !== 'undefined') {
      const items = await model.find(req.decodedJwt.subject)
      res.status(200).json(items)
    } else {
      next(new UnauthorizedError())
    }
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
    if (typeof req.decodedJwt !== 'undefined') {
      const item = await model.findById(req.decodedJwt.subject, req.params.id)
      res.status(200).json(item)
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve item',
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
    if (typeof req.decodedJwt !== 'undefined') {
      const [item] = req.baseUrl.includes('/bedhours')
        ? await model.insert({
            ...req.body,
            userId: req.decodedJwt.subject,
          })
        : await model.insert(req.body)
      res.status(201).json(item)
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Adding item failed',
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
    if (typeof req.decodedJwt !== 'undefined') {
      const updated = req.baseUrl.includes('/bedhours')
        ? await model.update(req.params.id, {
            ...req.body,
            userId: req.decodedJwt.subject,
          })
        : await model.update(req.params.id, req.body)

      res.status(200).json(updated)
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    console.error(error)
    next(
      new DatabaseError({
        message: 'Could not update item',
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
    console.error(error)
    next(
      new DatabaseError({
        message: 'Could not remove item',
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
