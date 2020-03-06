import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../../server/middleware/errorHandler'
import secret from '../../secrets'

type DecodedJwt = {
  subject: number
  username: string
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
    jwt.verify(token, secret, (error: Error, decodedJwt: object | string) => {
      if (error) {
        next(new UnauthorizedError())
      } else {
        req.decodedJwt = decodedJwt as DecodedJwt
        next()
      }
    })
  } else {
    next(new UnauthorizedError({ message: 'Failed to authenticate' }))
  }
}

export default checkAuth
