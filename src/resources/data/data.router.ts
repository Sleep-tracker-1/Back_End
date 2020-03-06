import { Router } from 'express'

import controllers from './data.controllers'
import checkAuth from '../../auth/middleware/checkAuth'
import { calculateSleepData } from './middleware/sleepData'

const router = Router()

router.route('/').get(checkAuth, controllers.getData)

export default router
