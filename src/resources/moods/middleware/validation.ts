import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../../utils/validator'

const { Success } = Validation

export const hasBody = (req: Request): boolean => !!req.body
export const hasWakeMood = (req: Request): boolean => !!req.body.wakeMood
export const hasMiddayMood = (req: Request): boolean => !!req.body.middayMood
export const hasNightMood = (req: Request): boolean =>
  typeof req.body.nightMood !== 'undefined'
export const hasNightId = (req: Request): boolean => !!req.body.nightId

export const bodyValidator = validator('Missing bed hour data', hasBody)
export const wakeMoodValidator = validator('Missing wake mood', hasWakeMood)
export const middayMoodValidator = validator(
  'Missing midday mood',
  hasMiddayMood
)
export const nightMoodValidator = validator('Missing night mood', hasNightMood)
export const nightIdValidator = validator('Missing night Id', hasNightId)

export const validationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(wakeMoodValidator(req))
    .concat(middayMoodValidator(req))
    .concat(nightMoodValidator(req))
    .concat(nightIdValidator(req))

export const checkValidation = (
  req: Request,
  _res: Response,
  next: NextFunction
): void =>
  didItValidate(validationResult(req))
    ? next()
    : next(
        new ValidationError(
          'Submitted data is incomplete or incorrect',
          validationResult(req).value
        )
      )

export default checkValidation
