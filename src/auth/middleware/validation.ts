import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../utils/validator'

const { Success } = Validation

const hasBody = (req: Request): boolean => !!req.body
const hasUsername = (req: Request): boolean => !!req.body.username
const hasPassword = (req: Request): boolean => !!req.body.password

const bodyValidator = validator('Missing user data', hasBody)
const usernameValidator = validator('Missing username', hasUsername)
const passwordValidator = validator('Missing password', hasPassword)

const validationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(usernameValidator(req))
    .concat(passwordValidator(req))

const checkValidation = (
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
