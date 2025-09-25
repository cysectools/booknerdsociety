import { Router } from 'express'

const router = Router()

// GET /api/books/search
router.get('/search', (req, res) => {
  res.json({ success: true, message: 'Book search endpoint' })
})

// GET /api/books/recommendations
router.get('/recommendations', (req, res) => {
  res.json({ success: true, message: 'Book recommendations endpoint' })
})

export default router
