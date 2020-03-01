import { Response, NextFunction } from 'express'
import { findById } from './users.model'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import { DatabaseError } from '../../server/middleware/errorHandler'

const getUser = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Don't want to ever respond with the user's hashed password
    const { password, first_name: firstName, ...user } = await findById(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.decodedJwt!.subject
    )
    res.status(200).json({ firstName, ...user })
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not retrieve user',
        dbMessage: error,
      })
    )
  }
}

export default getUser
