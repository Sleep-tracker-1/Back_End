import { Response, NextFunction } from 'express'
import { findById, remove } from './users.model'
import { AuthorizationRequest } from '../../auth/middleware/checkAuth'
import { DatabaseError } from '../../server/middleware/errorHandler'

const getUser = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Don't want to ever respond with the user's hashed password
    const { password, firstName, ...user } = await findById(
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

const deleteUser = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await remove(req.decodedJwt!.subject)
    res.status(200).json({ message: 'User deleted' })
  } catch (error) {
    next(
      new DatabaseError({
        message: 'Could not delete user',
        dbMessage: error,
      })
    )
  }
}

export default { getUser, deleteUser }
