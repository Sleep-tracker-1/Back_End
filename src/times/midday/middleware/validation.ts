import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../../utils/validator'

const { Success } = Validation

const hasBody = (req: Request): boolean => !!req.body
const hasMood = (req: Request): boolean => !!req.body.mood
const hasTiredness = (req: Request): boolean => !!req.body.tiredness

const bodyValidator = validator('Missing data', hasBody)
const moodValidator = validator('Missing mood', hasMood)
const tirednessValidator = validator('Missing tiredness', hasTiredness)

export const validationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(moodValidator(req))
    .concat(tirednessValidator(req))

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
