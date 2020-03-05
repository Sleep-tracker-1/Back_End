import { Router } from 'express'

import addWake from './wake.controllers'
import checkAuth from '../../auth/middleware/checkAuth'
import validate from './middleware/validation'

const router = Router()

router.route('/').put(checkAuth, validate, addWake)

export default router
