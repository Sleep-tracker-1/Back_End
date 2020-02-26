import { Request, Response } from 'express'

const apiRoot = (_req: Request, res: Response): Response =>
  res.status(200).json({ apiStatus: 'Running' })

export default { apiRoot }
