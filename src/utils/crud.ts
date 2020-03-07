/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { QueryBuilder } from 'knex'
import { DatabaseError } from '../server/middleware/errorHandler'
import { AuthorizationRequest } from '../auth/middleware/checkAuth'

export type Id = number | string | undefined

type Model = {
  find: (userId: Id, startDate?: Date, endDate?: Date) => QueryBuilder
  findById: (userId: Id, id: Id) => QueryBuilder<any>
  insert: (item: any, userId?: Id) => QueryBuilder<[any]>
  update: (id: Id, item: any, userId?: Id) => QueryBuilder<[any]>
  remove: (userId: Id, id: Id) => QueryBuilder<number>
}

export const getMany = (model: Model) => async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await model.find(req.decodedJwt!.subject)
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
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await model.findById(req.decodedJwt!.subject, req.params.id)
    res.status(200).json(item)
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
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [item] = req.baseUrl.includes('/bedhours')
      ? await model.insert(req.decodedJwt!.subject, {
          ...req.body,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: req.decodedJwt!.subject,
        })
      : await model.insert(req.decodedJwt!.subject, req.body)
    res.status(201).json(item)
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
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = req.baseUrl.includes('/bedhours')
      ? await model.update(req.decodedJwt!.subject, req.params.id, {
          ...req.body,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: req.decodedJwt!.subject,
        })
      : await model.update(req.decodedJwt!.subject, req.params.id, req.body)
    res.status(200).json(updated)
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not update item',
        dbMessage: error,
      })
    )
  }
}

export const removeOne = (model: Model) => async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await model.remove(req.decodedJwt!.subject, req.params.id)
    res.status(200).json({ message: `This item has been deleted` })
  } catch (error) {
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
