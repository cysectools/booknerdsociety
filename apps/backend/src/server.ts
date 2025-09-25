import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import bookRoutes from './routes/books'
import clubRoutes from './routes/clubs'
import friendRoutes from './routes/friends'
import messageRoutes from './routes/messages'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/clubs', clubRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/messages', messageRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use(notFound)
app.use(errorHandler)

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('join-club', (clubId) => {
    socket.join(`club-${clubId}`)
    console.log(`User ${socket.id} joined club ${clubId}`)
  })
  
  socket.on('leave-club', (clubId) => {
    socket.leave(`club-${clubId}`)
    console.log(`User ${socket.id} left club ${clubId}`)
  })
  
  socket.on('send-message', (data) => {
    socket.to(`club-${data.clubId}`).emit('new-message', data)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leftonread'
    await mongoose.connect(mongoURI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Start server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer().catch(console.error)

export { io }
