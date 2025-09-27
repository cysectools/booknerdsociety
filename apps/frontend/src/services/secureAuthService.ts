import { securityService } from './securityService'
import { encryptionService } from './encryptionService'

interface SecureUser {
  id: string
  username: string
  email: string
  passwordHash: string
  salt: string
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  lastLogin: number
  loginAttempts: number
  lockedUntil?: number
  sessionId?: string
  publicKey?: string
  privateKey?: string
}

interface LoginAttempt {
  ip: string
  timestamp: number
  success: boolean
  userAgent: string
}

class SecureAuthService {
  private users = new Map<string, SecureUser>()
  private loginAttempts = new Map<string, LoginAttempt[]>()
  private activeSessions = new Map<string, { userId: string; expiresAt: number; lastActivity: number }>()

  // Register new user with security measures
  async registerUser(username: string, email: string, password: string): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      // Input validation and sanitization
      const sanitizedUsername = securityService.sanitizeInput(username)
      const sanitizedEmail = securityService.sanitizeInput(email)
      
      if (!securityService.validateEmail(sanitizedEmail)) {
        return { success: false, message: 'Invalid email format' }
      }

      const passwordValidation = securityService.validatePassword(password)
      if (!passwordValidation.isValid) {
        return { success: false, message: `Password requirements not met: ${passwordValidation.feedback.join(', ')}` }
      }

      // Check if user already exists
      if (this.users.has(sanitizedEmail)) {
        return { success: false, message: 'User already exists' }
      }

      // Hash password with salt
      const { hash, salt } = securityService.hashPassword(password)

      // Generate encryption keys for user
      const keyPair = encryptionService.generateKeyPair()

      // Create secure user
      const user: SecureUser = {
        id: securityService.generateSecureToken(32),
        username: sanitizedUsername,
        email: sanitizedEmail,
        passwordHash: hash,
        salt,
        twoFactorEnabled: false,
        lastLogin: 0,
        loginAttempts: 0,
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey
      }

      this.users.set(sanitizedEmail, user)

      return { success: true, message: 'User registered successfully', userId: user.id }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'Registration failed' }
    }
  }

  // Secure login with multiple security layers
  async loginUser(email: string, password: string, _rememberMe: boolean = false): Promise<{ success: boolean; message: string; sessionId?: string; requires2FA?: boolean }> {
    try {
      // Rate limiting check
      const rateLimit = securityService.checkRateLimit(email)
      if (!rateLimit.allowed) {
        return { success: false, message: 'Too many login attempts. Please try again later.' }
      }

      // Input sanitization
      const sanitizedEmail = securityService.sanitizeInput(email)
      
      // Check if user exists
      const user = this.users.get(sanitizedEmail)
      if (!user) {
        this.recordLoginAttempt(sanitizedEmail, false)
        return { success: false, message: 'Invalid credentials' }
      }

      // Check if account is locked
      if (user.lockedUntil && Date.now() < user.lockedUntil) {
        const lockTime = Math.ceil((user.lockedUntil - Date.now()) / (1000 * 60))
        return { success: false, message: `Account locked. Try again in ${lockTime} minutes.` }
      }

      // Verify password
      const isValidPassword = securityService.verifyPassword(password, user.passwordHash, user.salt)
      if (!isValidPassword) {
        user.loginAttempts++
        if (user.loginAttempts >= 5) {
          user.lockedUntil = Date.now() + (30 * 60 * 1000) // Lock for 30 minutes
        }
        this.recordLoginAttempt(sanitizedEmail, false)
        return { success: false, message: 'Invalid credentials' }
      }

      // Check if 2FA is required
      if (user.twoFactorEnabled) {
        this.recordLoginAttempt(sanitizedEmail, true)
        return { success: true, message: '2FA required', requires2FA: true }
      }

      // Create secure session
      const session = securityService.createSecureSession(user.id)
      user.sessionId = session.sessionId
      user.lastLogin = Date.now()
      user.loginAttempts = 0
      user.lockedUntil = undefined

      // Store active session
      this.activeSessions.set(session.sessionId, {
        userId: user.id,
        expiresAt: session.expiresAt,
        lastActivity: Date.now()
      })

      this.recordLoginAttempt(sanitizedEmail, true)

      return { success: true, message: 'Login successful', sessionId: session.sessionId }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed' }
    }
  }

  // Verify 2FA code
  async verify2FA(email: string, code: string): Promise<{ success: boolean; message: string; sessionId?: string }> {
    try {
      const user = this.users.get(email)
      if (!user || !user.twoFactorEnabled) {
        return { success: false, message: '2FA not enabled' }
      }

      // In real implementation, you'd verify the TOTP code
      // For demo purposes, we'll accept any 6-digit code
      if (!/^\d{6}$/.test(code)) {
        return { success: false, message: 'Invalid 2FA code' }
      }

      // Create session after successful 2FA
      const session = securityService.createSecureSession(user.id)
      user.sessionId = session.sessionId
      user.lastLogin = Date.now()

      this.activeSessions.set(session.sessionId, {
        userId: user.id,
        expiresAt: session.expiresAt,
        lastActivity: Date.now()
      })

      return { success: true, message: '2FA verified', sessionId: session.sessionId }
    } catch (error) {
      console.error('2FA verification error:', error)
      return { success: false, message: '2FA verification failed' }
    }
  }

  // Validate session
  validateSession(sessionId: string): { isValid: boolean; userId?: string } {
    try {
      const session = this.activeSessions.get(sessionId)
      if (!session || Date.now() > session.expiresAt) {
        this.activeSessions.delete(sessionId)
        return { isValid: false }
      }

      // Update last activity
      session.lastActivity = Date.now()
      return { isValid: true, userId: session.userId }
    } catch (error) {
      console.error('Session validation error:', error)
      return { isValid: false }
    }
  }

  // Logout user
  logoutUser(sessionId: string): { success: boolean } {
    try {
      this.activeSessions.delete(sessionId)
      securityService.clearSession()
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false }
    }
  }

  // Enable 2FA
  async enable2FA(userId: string): Promise<{ success: boolean; secret?: string; qrCode?: string }> {
    try {
      const user = this.findUserById(userId)
      if (!user) {
        return { success: false }
      }

      // Generate 2FA secret (in real implementation, use proper TOTP library)
      const secret = securityService.generateSecureToken(32)
      user.twoFactorSecret = secret
      user.twoFactorEnabled = true

      // Generate QR code URL (simplified)
      const qrCode = `otpauth://totp/BookNerdSociety:${user.email}?secret=${secret}&issuer=BookNerdSociety`

      return { success: true, secret, qrCode }
    } catch (error) {
      console.error('2FA enable error:', error)
      return { success: false }
    }
  }

  // Record login attempt for security monitoring
  private recordLoginAttempt(email: string, success: boolean): void {
    const attempt: LoginAttempt = {
      ip: this.getClientIP(),
      timestamp: Date.now(),
      success,
      userAgent: navigator.userAgent
    }

    const attempts = this.loginAttempts.get(email) || []
    attempts.push(attempt)
    
    // Keep only last 10 attempts
    if (attempts.length > 10) {
      attempts.shift()
    }
    
    this.loginAttempts.set(email, attempts)
  }

  // Get client IP (simplified)
  private getClientIP(): string {
    // In real implementation, this would come from server headers
    return '127.0.0.1'
  }

  // Find user by ID
  private findUserById(userId: string): SecureUser | undefined {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        return user
      }
    }
    return undefined
  }

  // Get user's encryption keys
  getUserKeys(userId: string): { publicKey?: string; privateKey?: string } {
    const user = this.findUserById(userId)
    return {
      publicKey: user?.publicKey,
      privateKey: user?.privateKey
    }
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    const now = Date.now()
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now > session.expiresAt) {
        this.activeSessions.delete(sessionId)
      }
    }
  }

  // Get security statistics
  getSecurityStats(): { totalUsers: number; activeSessions: number; failedAttempts: number } {
    let failedAttempts = 0
    for (const attempts of this.loginAttempts.values()) {
      failedAttempts += attempts.filter(a => !a.success).length
    }

    return {
      totalUsers: this.users.size,
      activeSessions: this.activeSessions.size,
      failedAttempts
    }
  }
}

export const secureAuthService = new SecureAuthService()
