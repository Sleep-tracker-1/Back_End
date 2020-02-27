'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const validation_1 = tslib_1.__importDefault(require('folktale/validation'))
const validator_1 = require('../../utils/validator')
const { Success } = validation_1.default
const hasBody = req => !!req.body
const hasUsername = req => !!req.body.username
const hasPassword = req => !!req.body.password
const bodyValidator = validator_1.validator('Missing user data', hasBody)
const usernameValidator = validator_1.validator('Missing username', hasUsername)
const passwordValidator = validator_1.validator('Missing password', hasPassword)
const validationResult = req =>
  Success()
    .concat(bodyValidator(req))
    .concat(usernameValidator(req))
    .concat(passwordValidator(req))
const checkValidation = (req, _res, next) =>
  validator_1.didItValidate(validationResult(req))
    ? next()
    : next(
        new validator_1.ValidationError(
          'Submitted data is incomplete or incorrect',
          validationResult(req).value
        )
      )
exports.default = checkValidation
