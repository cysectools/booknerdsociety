import CryptoJS from 'crypto-js'

// Security configuration
const SECURITY_CONFIG = {
  ENCRYPTION_KEY: (import.meta as any).env?.VITE_APP_ENCRYPTION_KEY || 'default-key-change-in-production',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS_PER_WINDOW: 100,
  CSP_POLICY: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:;"
}

// Input sanitization patterns
const SANITIZATION_PATTERNS = {
  XSS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  HTML_TAGS: /<[^>]*>/g,
  JAVASCRIPT_PROTOCOLS: /javascript:/gi,
  DATA_PROTOCOLS: /data:/gi,
  VBSCRIPT: /vbscript:/gi,
  ONLOAD: /on\w+\s*=/gi,
  SCRIPT_TAGS: /<script[^>]*>.*?<\/script>/gi,
  IFRAME_TAGS: /<iframe[^>]*>.*?<\/iframe>/gi,
  OBJECT_TAGS: /<object[^>]*>.*?<\/object>/gi,
  EMBED_TAGS: /<embed[^>]*>.*?<\/embed>/gi,
  FORM_TAGS: /<form[^>]*>.*?<\/form>/gi,
  INPUT_TAGS: /<input[^>]*>.*?<\/input>/gi
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

class SecurityService {
  // Input sanitization and validation
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return ''
    
    let sanitized = input
    
    // Remove all dangerous patterns
    Object.values(SANITIZATION_PATTERNS).forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
    
    // HTML encode special characters
    sanitized = this.htmlEncode(sanitized)
    
    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    
    // Trim and limit length
    sanitized = sanitized.trim().substring(0, 10000)
    
    return sanitized
  }

  // HTML encoding for XSS prevention
  htmlEncode(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email) && email.length <= 254
  }

  // Validate password strength
  validatePassword(password: string): { isValid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = []
    let score = 0

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long')
    } else {
      score += 1
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter')
    } else {
      score += 1
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter')
    } else {
      score += 1
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain at least one number')
    } else {
      score += 1
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain at least one special character')
    } else {
      score += 1
    }

    return {
      isValid: score >= 4,
      score,
      feedback
    }
  }

  // Rate limiting
  checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW
    
    // Clean old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < windowStart) {
        rateLimitStore.delete(key)
      }
    }

    const current = rateLimitStore.get(identifier) || { count: 0, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW }
    
    if (current.resetTime < now) {
      current.count = 0
      current.resetTime = now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
    }

    current.count++
    rateLimitStore.set(identifier, current)

    return {
      allowed: current.count <= SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW,
      remaining: Math.max(0, SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW - current.count),
      resetTime: current.resetTime
    }
  }

  // Generate secure random tokens
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const randomArray = new Uint8Array(length)
    crypto.getRandomValues(randomArray)
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length]
    }
    
    return result
  }

  // Hash passwords with salt
  hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || this.generateSecureToken(16)
    const hash = CryptoJS.PBKDF2(password, actualSalt, {
      keySize: 256 / 32,
      iterations: 10000
    }).toString()
    
    return { hash, salt: actualSalt }
  }

  // Verify password
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const testHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 10000
    }).toString()
    
    return testHash === hash
  }

  // Encrypt sensitive data
  encryptData(data: string, key?: string): string {
    const encryptionKey = key || SECURITY_CONFIG.ENCRYPTION_KEY
    return CryptoJS.AES.encrypt(data, encryptionKey).toString()
  }

  // Decrypt sensitive data
  decryptData(encryptedData: string, key?: string): string {
    const encryptionKey = key || SECURITY_CONFIG.ENCRYPTION_KEY
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  // Generate CSRF token
  generateCSRFToken(): string {
    return this.generateSecureToken(32)
  }

  // Validate CSRF token
  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken && token.length === 32
  }

  // Set security headers
  setSecurityHeaders(): void {
    // Content Security Policy
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = SECURITY_CONFIG.CSP_POLICY
    document.head.appendChild(meta)

    // Additional security headers would be set by the server
    // This is a client-side implementation
  }

  // Session management
  createSecureSession(userId: string): { sessionId: string; expiresAt: number } {
    const sessionId = this.generateSecureToken(64)
    const expiresAt = Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT
    
    // Store session securely (in real app, this would be server-side)
    const sessionData = {
      userId,
      sessionId,
      expiresAt,
      createdAt: Date.now(),
      lastActivity: Date.now()
    }
    
    localStorage.setItem('secure_session', this.encryptData(JSON.stringify(sessionData)))
    
    return { sessionId, expiresAt }
  }

  // Validate session
  validateSession(): { isValid: boolean; userId?: string; sessionId?: string } {
    try {
      const encryptedSession = localStorage.getItem('secure_session')
      if (!encryptedSession) return { isValid: false }
      
      const sessionData = JSON.parse(this.decryptData(encryptedSession))
      
      if (Date.now() > sessionData.expiresAt) {
        localStorage.removeItem('secure_session')
        return { isValid: false }
      }
      
      // Update last activity
      sessionData.lastActivity = Date.now()
      localStorage.setItem('secure_session', this.encryptData(JSON.stringify(sessionData)))
      
      return { isValid: true, userId: sessionData.userId, sessionId: sessionData.sessionId }
    } catch (error) {
      console.error('Session validation error:', error)
      localStorage.removeItem('secure_session')
      return { isValid: false }
    }
  }

  // Clear session
  clearSession(): void {
    localStorage.removeItem('secure_session')
  }
}

export const securityService = new SecurityService()
