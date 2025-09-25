import { Router } from 'express'
import { auth } from '../middleware/auth'

const router = Router()

// All message routes require authentication
router.use(auth)

// GET /api/messages/:clubId
router.get('/:clubId', (req, res) => {
  res.json({ success: true, message: 'Get club messages endpoint' })
})

// POST /api/messages
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Send message endpoint' })
})

export default router
