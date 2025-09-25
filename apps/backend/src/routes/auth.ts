import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, getCurrentUser, refreshToken } from '../controllers/authController'
import { auth } from '../middleware/auth'

const router = Router()

// POST /api/auth/register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register)

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], login)

// GET /api/auth/me
router.get('/me', auth, getCurrentUser)

// POST /api/auth/refresh
router.post('/refresh', refreshToken)

export default router
