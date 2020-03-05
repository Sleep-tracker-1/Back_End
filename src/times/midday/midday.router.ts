import { Router } from 'express'

import addMidday from './midday.controllers'
import checkAuth from '../../auth/middleware/checkAuth'

const router = Router()

router.route('/').put(checkAuth, addMidday)

export default router
