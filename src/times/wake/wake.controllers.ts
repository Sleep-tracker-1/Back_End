import { NextFunction, Response } from 'express'
import { sub } from 'date-fns'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import { update as updateMood } from '../../resources/moods/moods.model'
import { update as updateTired } from '../../resources/tiredness/tiredness.model'
import { findBedtime } from '../../resources/bedhours/bedhours.model'
import wakeModel from './wake.model'

const addWake = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [dateToUpdate] = await findBedtime(
      sub(new Date(req.body.time), { days: 1 }),
      new Date(req.body.time)
    )

    const addMood = await updateMood(dateToUpdate.id, {
      wakeMood: req.body.mood,
      nightId: dateToUpdate.id,
    })

    const addTired = await updateTired(dateToUpdate.id, {
      wakeTired: req.body.tiredness,
      nightId: dateToUpdate.id,
    })

    const [wakeTime] = await wakeModel.updateTime(
      dateToUpdate.id,
      req.body.time,
      dateToUpdate.bedtime,
      req.decodedJwt!.subject
    )

    res.status(201).json({ wakeTime, addMood, addTired })
  } catch (error) {
    console.error(error)
  }
}

export default addWake
