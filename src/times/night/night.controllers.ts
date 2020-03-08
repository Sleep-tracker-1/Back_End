import { Request, NextFunction, Response } from 'express'
import nightModel from './night.model'
import {
  DatabaseError,
  UnauthorizedError,
} from '../../server/middleware/errorHandler'

const addNight = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.decodedJwt !== 'undefined') {
      const [nightTime] = await nightModel.insertTime(
        req.body.time,
        req.decodedJwt.subject
      )
      const [nightMood] = await nightModel.insertMood(
        req.body.mood,
        nightTime.id
      )
      const [nightTired] = await nightModel.insertTiredness(
        req.body.tiredness,
        nightTime.id
      )

      res.status(201).json({ nightTime, nightMood, nightTired })
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

export default addNight
