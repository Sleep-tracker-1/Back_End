import { Router } from 'express'

import controllers from './bedhours.controllers'
import checkAuth from '../../auth/middleware/checkAuth'
import { checkValidation } from './middleware/validation'

const router = Router()

router.route('/').post(checkAuth, checkValidation, controllers.createOne)

export default router
