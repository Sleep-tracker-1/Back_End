import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../../utils/validator'

const { Success } = Validation

const hasItemToUpdate = (req: Request): boolean =>
  !!req.body ||
  !!req.body.wakeMood ||
  !!req.body.middayMood ||
  !!req.body.nightMood ||
  !!req.body.nightId

const updateValidator = validator(
  'Missing mood or nightId to update',
  hasItemToUpdate
)

const validationResult = (req: Request): Matcher =>
  Success().concat(updateValidator(req))

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
