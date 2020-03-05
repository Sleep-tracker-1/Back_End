import { Router } from 'express'

import addMidday from './midday.controllers'
import checkAuth from '../../auth/middleware/checkAuth'
import validate from './middleware/validation'

const router = Router()

router.route('/').put(checkAuth, validate, addMidday)

export default router
