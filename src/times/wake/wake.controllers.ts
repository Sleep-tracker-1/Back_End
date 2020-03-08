import { Request, NextFunction, Response } from 'express'
import { sub } from 'date-fns'
import { update as updateMood } from '../../resources/moods/moods.model'
import { update as updateTired } from '../../resources/tiredness/tiredness.model'
import { findBedtime } from '../../resources/bedhours/bedhours.model'
import wakeModel from './wake.model'
import {
  DatabaseError,
  UnauthorizedError,
} from '../../server/middleware/errorHandler'

const addWake = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.decodedJwt !== 'undefined') {
      const [dateToUpdate] = await findBedtime(
        req.decodedJwt.subject,
        sub(new Date(req.body.time), { days: 1 }),
        new Date(req.body.time)
      )

      const addMood = await updateMood(dateToUpdate.id, {
        wakeMood: req.body.mood,
      })

      const addTired = await updateTired(dateToUpdate.id, {
        wakeTired: req.body.tiredness,
      })

      const [wakeTime] = await wakeModel.updateTime(
        dateToUpdate.id,
        req.body.time,
        dateToUpdate.bedtime,
        req.decodedJwt.subject
      )

      res.status(201).json({ wakeTime, addMood, addTired })
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not update item',
        dbMessage: error,
      })
    )
  }
}

export default addWake
