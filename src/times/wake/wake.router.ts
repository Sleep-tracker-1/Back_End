import { Router } from 'express'

import addWake from './wake.controllers'
import checkAuth from '../../auth/middleware/checkAuth'

const router = Router()

router.route('/').put(checkAuth, addWake)

export default router
