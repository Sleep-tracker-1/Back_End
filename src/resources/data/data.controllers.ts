import { NextFunction, Response } from 'express'
import { differenceInMinutes, format } from 'date-fns'
import { findById } from '../users/users.model'
import { getAllData, SleepData } from './data.model'
import { DatabaseError } from '../../server/middleware/errorHandler'
import { RequestWithData } from './middleware/sleepData'

const getData = async (
  req: RequestWithData,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const averages = req.sleepData.match(/\d+\.+\d+/g).map(Number)
    const start = req.query.start
      ? req.query.start.split('-')
      : '1-1-1900'.split('-')
    const end = req.query.end ? req.query.end.split('-') : '1-1-2040'.split('-')

    const userInfo = await findById(req.decodedJwt!.subject)
    const sleepData = await getAllData(
      req.decodedJwt!.subject,
      new Date(start[2], start[0] - 1, start[1]),
      new Date(end[2], end[0] - 1, end[1])
    )

    const formattedData = sleepData.map((night: SleepData) => {
      return {
        date: format(night.waketime, 'M/d/yy'),
        dateId: night.dateId,
        sleepRecommendation: averages[0],
        averageHoursOfSleep: averages[1],
        averageMood: averages[2],
        averageTiredness: averages[3],
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
    next(
      new DatabaseError({
        message: 'Could not retrieve items',
        dbMessage: error,
      })
    )
  }
}

export default { getData }
