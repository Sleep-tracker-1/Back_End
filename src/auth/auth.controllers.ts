import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { findBy, insert } from '../resources/users/users.model'
import {
  UnauthorizedError,
  DatabaseError,
} from '../server/middleware/errorHandler'
import jwtSecret from '../secrets'

export const generateToken = (id: number, username: string): string =>
  jwt.sign(
    {
      subject: id,
      username,
    },
    jwtSecret,
    {
      expiresIn: '1d',
    }
  )

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const user = req.body

  const hash = bcrypt.hashSync(user.password, 10)
  const hashedUser = { ...user, password: hash }

  try {
    const [registeredUser] = await insert(hashedUser)
    res.status(201).json({
      userInfo: registeredUser,
      token: generateToken(registeredUser.id, registeredUser.username),
    })
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Registration failed',
        dbMessage: error,
      })
    )
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body
    const userToLogin = await findBy({ username }).first()

    if (userToLogin && bcrypt.compareSync(password, userToLogin.password)) {
      res.status(200).json({
        message: `Welcome ${userToLogin.firstName}!`,
        token: generateToken(userToLogin.id, userToLogin.username),
      })
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Login failed',
        dbMessage: error,
      })
    )
  }
}

export default {
  register,
  login,
}
