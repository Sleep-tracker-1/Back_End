import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../../server/middleware/errorHandler'
import { ValidationError } from '../../utils/validator'
import secret from '../../secrets'

type DecodedJwt = {
  subject: number
  username: string
  department: string
  iat: number
  exp: number
}

export interface AuthorizationRequest extends Request {
  decodedJwt?: DecodedJwt
}

const checkAuth = (
  req: AuthorizationRequest,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization

  if (req.decodedJwt) {
    next()
  } else if (token) {
    jwt.verify(token, secret, (error, decodedJwt) => {
      if (error) {
        next(new UnauthorizedError({ message: 'You shall not pass!' }))
      } else {
        req.decodedJwt = decodedJwt as DecodedJwt
        next()
      }
    })
  } else {
    next(
      new ValidationError('Failed to authenticate', [
        'Missing authentication token',
      ])
    )
  }
}
export default checkAuth
