import { Router } from 'express'

import addNight from './night.controllers'
import checkAuth from '../../auth/middleware/checkAuth'

const router = Router()

router.route('/').post(checkAuth, addNight)

export default router
