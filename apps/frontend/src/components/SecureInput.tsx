import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { securityService } from '../services/securityService'

interface SecureInputProps {
  type?: 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  maxLength?: number
  required?: boolean
  disabled?: boolean
  label?: string
  error?: string
  showSecurityIndicator?: boolean
}

const SecureInput: React.FC<SecureInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  maxLength = 1000,
  required = false,
  disabled = false,
  label,
  error,
  showSecurityIndicator = true
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // Security validation
  useEffect(() => {
    if (type === 'password' && value) {
      const validation = securityService.validatePassword(value)
      if (validation.score >= 4) {
        setSecurityLevel('high')
      } else if (validation.score >= 2) {
        setSecurityLevel('medium')
      } else {
        setSecurityLevel('low')
      }
    } else if (type === 'email' && value) {
      const isValid = securityService.validateEmail(value)
      setSecurityLevel(isValid ? 'high' : 'low')
    } else {
      setSecurityLevel('low')
    }
  }, [value, type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = e.target.value
    const sanitizedValue = securityService.sanitizeInput(rawValue)
    
    // Apply length limit
    const limitedValue = sanitizedValue.substring(0, maxLength)
    
    onChange(limitedValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'high': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getSecurityIcon = () => {
    switch (securityLevel) {
      case 'high': return '🔒'
      case 'medium': return '⚠️'
      case 'low': return '🔓'
      default: return '🔒'
    }
  }

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
    ${isFocused ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}
    ${error ? 'border-red-500 ring-2 ring-red-200' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    focus:outline-none focus:ring-2 focus:ring-primary-200
    ${className}
  `

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            className={`${inputClasses} resize-none`}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type === 'password' && showPassword ? 'text' : type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            className={inputClasses}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
          />
        )}

        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}

        {/* Security indicator */}
        {showSecurityIndicator && value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <span className={`text-xs ${getSecurityColor()}`}>
              {getSecurityIcon()}
            </span>
            <span className={`text-xs font-medium ${getSecurityColor()}`}>
              {securityLevel.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Character count */}
      {maxLength && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Security feedback */}
      {type === 'password' && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2"
        >
          <div className={`text-xs ${getSecurityColor()}`}>
            Security Level: {securityLevel.toUpperCase()}
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.div>
      )}
    </div>
  )
}

export default SecureInput
