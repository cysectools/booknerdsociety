import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error)

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message)
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    })
    return
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
    return
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
    return
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired'
    })
    return
  }

  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  })
}
