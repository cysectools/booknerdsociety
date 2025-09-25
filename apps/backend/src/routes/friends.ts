import { Router } from 'express'
import { auth } from '../middleware/auth'

const router = Router()

// All friend routes require authentication
router.use(auth)

// GET /api/friends
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get friends endpoint' })
})

// POST /api/friends/add
router.post('/add', (req, res) => {
  res.json({ success: true, message: 'Add friend endpoint' })
})

// DELETE /api/friends/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Remove friend endpoint' })
})

export default router
