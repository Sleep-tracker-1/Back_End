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
export const hasBedtime = (req: Request): boolean => !!req.body.bedtime
export const hasWaketime = (req: Request): boolean => !!req.body.waketime

export const bodyValidator = validator('Missing bed hour data', hasBody)
export const bedTimeValidator = validator('Missing bedtime', hasBedtime)
export const wakeTimeValidator = validator('Missing waketime', hasWaketime)

export const validationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(bedTimeValidator(req))
    .concat(wakeTimeValidator(req))

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
