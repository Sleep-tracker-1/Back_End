import { Router } from 'express'

import controllers from './api.controllers'
import authRouter from '../auth/auth.router'
import usersRouter from '../resources/users/users.router'
import bedHoursRouter from '../resources/bedhours/bedhours.router'
import dataRouter from '../resources/data/data.router'
import moodsRouter from '../resources/moods/moods.router'
import tirednessRouter from '../resources/tiredness/tiredness.router'
import nightRouter from '../times/night/night.router'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', usersRouter)
router.use('/bedhours', bedHoursRouter)
router.use('/moods', moodsRouter)
router.use('/tirendess', tirednessRouter)
router.use('/data', dataRouter)
router.use('/night', nightRouter)

router.route('/').get(controllers.apiRoot)

export default router
