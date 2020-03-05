import { NextFunction, Response } from 'express'
import { add, differenceInMinutes, format } from 'date-fns'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import { findById } from '../users/users.model'
import { getAllData, SleepData } from './data.model'

const getData = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const start = req.query.start
      ? req.query.start.split('-')
      : '1-1-1900'.split('-')
    const end = req.query.end ? req.query.end.split('-') : '1-1-2040'.split('-')

    const userInfo = await findById(req.decodedJwt!.subject)
    const sleepData = await getAllData(
      req.decodedJwt!.subject,
      new Date(start[2], start[0], start[1]),
      new Date(end[2], end[0], end[1])
    )

    console.log(new Date(start[2], start[0], start[1]))

    const formattedData = sleepData.map((night: SleepData) => {
      return {
        date: format(night.waketime, 'M/d/yy'),
        dateId: night.dateId,
        totalTimeInBed: (
          differenceInMinutes(night.waketime, night.bedtime) / 60
        ).toFixed(1),
        wakeUp: {
          time: night.waketime,
          mood: night.wakeMood,
          tiredness: night.wakeTired,
        },
        midday: {
          mood: night.middayMood,
          tiredness: night.middayTired,
        },
        bedtime: {
          time: night.bedtime,
          mood: night.nightMood,
          tiredness: night.nightTired,
        },
      }
    })

    const data = {
      userId: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      sleepRecommendation: null,
      dates: formattedData,
    }

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
  }
}

export default { getData }
