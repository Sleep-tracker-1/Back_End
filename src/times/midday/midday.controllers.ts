import { Request, NextFunction, Response } from 'express'
import { findWaketimeFromMidday } from '../../resources/bedhours/bedhours.model'
import { update as updateMood } from '../../resources/moods/moods.model'
import { update as updateTired } from '../../resources/tiredness/tiredness.model'
import {
  DatabaseError,
  UnauthorizedError,
} from '../../server/middleware/errorHandler'

const addMidday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.decodedJwt !== 'undefined') {
      const [dateToUpdate] = await findWaketimeFromMidday(
        req.decodedJwt.subject
      )

      const addMood = await updateMood(dateToUpdate.id, {
        middayMood: req.body.mood,
      })

      const addTired = await updateTired(dateToUpdate.id, {
        middayTired: req.body.tiredness,
      })

      res.status(200).json({ addMood, addTired })
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

export default addMidday
