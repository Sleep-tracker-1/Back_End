import { Router } from 'express'

import controllers from './api.controllers'
import authRouter from '../auth/auth.router'
import usersRouter from '../resources/users/users.router'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)

router.route('/').get(controllers.apiRoot)

export default router
