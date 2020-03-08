import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../../utils/validator'

const { Success } = Validation

const hasBedOrWakeTime = (req: Request): boolean =>
  !!req.body && (!!req.body.waketime || !!req.body.bedtime)

export const bedWakeTimeValidator = validator(
  'Missing bedtime or waketime',
  hasBedOrWakeTime
)

export const validationResult = (req: Request): Matcher =>
  Success().concat(bedWakeTimeValidator(req))

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
