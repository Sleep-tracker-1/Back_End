import { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import {
  validator,
  didItValidate,
  Matcher,
  ValidationError,
} from '../../utils/validator'

const { Success } = Validation

export const hasBody = (req: Request): boolean => !!req.body
export const hasUsername = (req: Request): boolean => !!req.body.username
export const hasPassword = (req: Request): boolean => !!req.body.password
export const passwordMinLength = (req: Request): boolean =>
  hasPassword(req) && req.body.password.length >= 6
export const hasFirstName = (req: Request): boolean => !!req.body.firstName
export const hasEmail = (req: Request): boolean => !!req.body.email

export const bodyValidator = validator('Missing user data', hasBody)
export const usernameValidator = validator('Missing username', hasUsername)
export const passwordValidator = validator('Missing password', hasPassword)
export const passwordLengthValidator = validator(
  'Password must be at least 6 characters',
  passwordMinLength
)
export const firstNameValidator = validator('Missing first name', hasFirstName)
export const emailValidator = validator('Missing email', hasEmail)

export const registerValidationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(usernameValidator(req))
    .concat(passwordValidator(req))
    .concat(firstNameValidator(req))
    .concat(emailValidator(req))
    .concat(passwordLengthValidator(req))

export const loginValidationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(usernameValidator(req))
    .concat(passwordValidator(req))

export const checkValidation = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.path.includes('register')) {
    return didItValidate(registerValidationResult(req))
      ? next()
      : next(
          new ValidationError(
            'Submitted data is incomplete or incorrect',
            registerValidationResult(req).value
          )
        )
  }

  return didItValidate(loginValidationResult(req))
    ? next()
    : next(
        new ValidationError(
          'Submitted data is incomplete or incorrect',
          loginValidationResult(req).value
        )
      )
}

export default checkValidation
