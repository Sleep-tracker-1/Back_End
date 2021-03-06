import { Router } from 'express'

import validateUser from './middleware/validation'
import controllers, { login } from './auth.controllers'

const router = Router()

router.route('/register').post(validateUser, controllers.register)
router.route('/login').post(validateUser, login)

export default router
