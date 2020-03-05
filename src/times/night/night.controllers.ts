import { NextFunction, Response } from 'express'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import nightModel from './night.model'
import { DatabaseError } from '../../server/middleware/errorHandler'

const addNight = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [nightTime] = await nightModel.insertTime(
      req.body.time,
      req.decodedJwt!.subject
    )
    const [nightMood] = await nightModel.insertMood(req.body.mood, nightTime.id)
    const [nightTired] = await nightModel.insertTiredness(
      req.body.tiredness,
      nightTime.id
    )

    res.status(201).json({ nightTime, nightMood, nightTired })
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
