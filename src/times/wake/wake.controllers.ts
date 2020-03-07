import { NextFunction, Response } from 'express'
import { sub } from 'date-fns'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import { update as updateMood } from '../../resources/moods/moods.model'
import { update as updateTired } from '../../resources/tiredness/tiredness.model'
import { findBedtime } from '../../resources/bedhours/bedhours.model'
import wakeModel from './wake.model'
import { DatabaseError } from '../../server/middleware/errorHandler'

const addWake = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [dateToUpdate] = await findBedtime(
      req.decodedJwt!.subject,
      sub(new Date(req.body.time), { days: 1 }),
      new Date(req.body.time)
    )

    const addMood = await updateMood(dateToUpdate.id, {
      wakeMood: req.body.mood,
    })
    console.log({ addMood })

    const addTired = await updateTired(dateToUpdate.id, {
      wakeTired: req.body.tiredness,
    })

    console.log({ addTired })

    const [wakeTime] = await wakeModel.updateTime(
      dateToUpdate.id,
      req.body.time,
      dateToUpdate.bedtime,
      req.decodedJwt!.subject
    )

    console.log({ wakeTime })

    res.status(201).json({ wakeTime, addMood, addTired })
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

export default addWake
