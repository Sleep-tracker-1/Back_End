import { Request, Response, NextFunction } from 'express'
import { findById, remove } from './users.model'
import {
  DatabaseError,
  UnauthorizedError,
} from '../../server/middleware/errorHandler'

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.decodedJwt !== 'undefined') {
      // Don't want to ever respond with the user's hashed password
      const { password, firstName, ...user } = await findById(
        req.decodedJwt.subject
      )
      res.status(200).json({ firstName, ...user })
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve user',
        dbMessage: error,
      })
    )
  }
}

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.decodedJwt !== 'undefined') {
      await remove(req.decodedJwt.subject)
      res.status(200).json({ message: 'User deleted' })
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not delete user',
        dbMessage: error,
      })
    )
  }
}

export default { getUser, deleteUser }
