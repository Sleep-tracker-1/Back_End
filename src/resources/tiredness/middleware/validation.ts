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
export const hasWakeTired = (req: Request): boolean => !!req.body.wakeTired
export const hasMiddayTired = (req: Request): boolean => !!req.body.middayTired
export const hasNightTired = (req: Request): boolean =>
  typeof req.body.nightTired !== 'undefined'
export const hasNightId = (req: Request): boolean => !!req.body.nightId

export const bodyValidator = validator('Missing bed hour data', hasBody)
export const wakeTiredValidator = validator('Missing wake tired', hasWakeTired)
export const middayTiredValidator = validator(
  'Missing midday tired',
  hasMiddayTired
)
export const nightTiredValidator = validator(
  'Missing night tired',
  hasNightTired
)
export const nightIdValidator = validator('Missing night Id', hasNightId)

export const validationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(wakeTiredValidator(req))
    .concat(middayTiredValidator(req))
    .concat(nightTiredValidator(req))
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
