import { Router } from 'express'
import { auth } from '../middleware/auth'

const router = Router()

// All user routes require authentication
router.use(auth)

// GET /api/users/profile
router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile endpoint' })
})

// PUT /api/users/profile
router.put('/profile', (req, res) => {
  res.json({ success: true, message: 'Update profile endpoint' })
})

export default router
