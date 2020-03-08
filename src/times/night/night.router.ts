import { Router } from 'express'

import addNight from './night.controllers'
import checkAuth from '../../auth/middleware/checkAuth'
import validate from './middleware/validation'

const router = Router()

router.route('/').post(checkAuth, validate, addNight)

export default router
