import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User, findBy, insert } from '../resources/users/users.model'
import {
  UnauthorizedError,
  DatabaseError,
} from '../server/middleware/errorHandler'
import jwtSecret from '../secrets'

const generateToken = ({ id, username }: User): string =>
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
    const registeredUser = await insert(hashedUser)
    res.status(201).json({
      userInfo: registeredUser[0],
      token: generateToken(registeredUser),
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

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.body

  try {
    const userToLogin = await findBy({ username }).first()

    if (userToLogin && bcrypt.compareSync(password, userToLogin.password)) {
      res.status(200).json({
        message: `Welcome ${username}!`,
        token: generateToken(userToLogin),
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
