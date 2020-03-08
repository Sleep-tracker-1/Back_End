import { Router } from 'express'

import controllers from './tiredness.controllers'
import checkAuth from '../../auth/middleware/checkAuth'
import { checkValidation } from './middleware/validation'

const router = Router()

router
  .route('/')
  .get(checkAuth, controllers.getMany)
  .post(checkAuth, checkValidation, controllers.createOne)

router
  .route('/:id')
  .get(checkAuth, controllers.getOne)
  .put(checkAuth, checkValidation, controllers.updateOne)
  .delete(checkAuth, controllers.removeOne)

export default router
