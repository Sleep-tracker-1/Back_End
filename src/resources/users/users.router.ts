import { Router } from 'express'

import controllers from './users.controllers'
import checkAuth from '../../auth/middleware/checkAuth'

const router = Router()

router.route('/').get(checkAuth, controllers.getUser)
router.route('/delete').delete(checkAuth, controllers.deleteUser)

export default router
