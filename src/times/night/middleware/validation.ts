import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import { differenceInHours, format, sub } from 'date-fns'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../../utils/validator'
import { findBedtime as findBedhours } from '../../../resources/bedhours/bedhours.model'

const { Success } = Validation

const hasBody = (req: Request): boolean => !!req.body
const hasTime = (req: Request): boolean => !!req.body.time
const hasMood = (req: Request): boolean => !!req.body.mood
const hasTiredness = (req: Request): boolean => !!req.body.tiredness

const checkDate = async (req: Request): Promise<boolean> => {
  const bedHours = await findBedhours(
    sub(new Date(req.body.time), { years: 100 }),
    new Date(req.body.time)
  )

  return !bedHours
    .map(date => differenceInHours(new Date(req.body.time), date.bedtime))
    .some(time => time < 12)
}

const bodyValidator = validator('Missing data', hasBody)
const timeValidator = validator('Missing time', hasTime)
const moodValidator = validator('Missing mood', hasMood)
const tirednessValidator = validator('Missing tiredness', hasTiredness)

export const validationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(timeValidator(req))
    .concat(moodValidator(req))
    .concat(tirednessValidator(req))

export const checkValidation = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!(await checkDate(req))) {
    if (!didItValidate(validationResult(req))) {
      next(
        new ValidationError(
          'Submitted data is incomplete or incorrect',
          validationResult(req).value.concat(
            'Bedtime for this day has already been added'
          )
        )
      )
    } else {
      next(
        new ValidationError('Submitted data is incomplete or incorrect', [
          'Bedtime for this day has already been added',
        ])
      )
    }
  } else if (didItValidate(validationResult(req))) {
    next()
  } else {
    next(
      new ValidationError(
        'Submitted data is incomplete or incorrect',
        validationResult(req).value
      )
    )
  }
}

export default checkValidation
