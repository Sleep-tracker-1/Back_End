import { NextFunction, Response } from 'express'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import nightModel from './night.model'

const addNight = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body.time)
    console.log(new Date(req.body.time))

    const [nightTime] = await nightModel.insertTime(
      new Date(req.body.time),
      req.decodedJwt!.subject
    )
    const [nightMood] = await nightModel.insertMood(req.body.mood, nightTime.id)
    const [nightTired] = await nightModel.insertTiredness(
      req.body.tiredness,
      nightTime.id
    )

    res.status(201).json({ nightTime, nightMood, nightTired })
  } catch (error) {
    console.error(error)
  }
}

export default addNight
