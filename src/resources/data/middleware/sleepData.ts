import { Response, NextFunction } from 'express'
import { PythonShell } from 'python-shell'
import { sub } from 'date-fns'
import { AuthorizationRequest } from '../../../auth/middleware/checkAuth'
import { find } from '../../bedhours/bedhours.model'
import { findAnyNull } from '../data.model'

export type RequestWithData = AuthorizationRequest & {
  sleepData?: any
}

export const calculateSleepData = async (
  req: RequestWithData,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const options = {
    pythonPath: process.env.PYTHON_PATH,
    pythonOptions: ['-u'],
    args: [`${req.decodedJwt!.username}`],
  }

  const bedHours = await find(
    req.decodedJwt!.subject,
    sub(new Date(), { years: 100 }),
    new Date()
  )

  if (bedHours.length > 30) {
    PythonShell.run(
      `${process.env.SCRIPT_PATH || '/app/dataScience/analysis.py'}`,
      options,
      (error, results) => {
        if (error) {
          next(error)
        } else {
          req.sleepData = results
          next()
        }
      }
    )
  } else {
    next()
  }
}
