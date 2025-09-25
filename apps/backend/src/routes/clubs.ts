import { Router } from 'express'
import { auth } from '../middleware/auth'

const router = Router()

// GET /api/clubs
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get all clubs endpoint' })
})

// GET /api/clubs/:id
router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Get club by ID endpoint' })
})

// POST /api/clubs
router.post('/', auth, (req, res) => {
  res.json({ success: true, message: 'Create club endpoint' })
})

// PUT /api/clubs/:id
router.put('/:id', auth, (req, res) => {
  res.json({ success: true, message: 'Update club endpoint' })
})

// DELETE /api/clubs/:id
router.delete('/:id', auth, (req, res) => {
  res.json({ success: true, message: 'Delete club endpoint' })
})

export default router
