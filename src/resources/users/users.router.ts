import { Router } from 'express'

import getUser from './users.controllers'
import checkAuth from '../../auth/middleware/checkAuth'

const router = Router()

router.route('/').get(checkAuth, getUser)

export default router
