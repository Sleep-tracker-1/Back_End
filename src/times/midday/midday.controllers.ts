import { NextFunction, Response } from 'express'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import { findWaketimeFromMidday } from '../../resources/bedhours/bedhours.model'
import { update as updateMood } from '../../resources/moods/moods.model'
import { update as updateTired } from '../../resources/tiredness/tiredness.model'

const addMidday = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [dateToUpdate] = await findWaketimeFromMidday()

    const addMood = await updateMood(dateToUpdate.id, {
      middayMood: req.body.mood,
      nightId: dateToUpdate.id,
    })

    const addTired = await updateTired(dateToUpdate.id, {
      middayTired: req.body.tiredness,
      nightId: dateToUpdate.id,
    })

    res.status(201).json({ addMood, addTired })
  } catch (error) {
    console.error(error)
  }
}

export default addMidday
