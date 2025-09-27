import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { encryptionService } from '../services/encryptionService'
import { secureAuthService } from '../services/secureAuthService'
import { secureMessagingService } from '../services/secureMessagingService'

interface SecurityDashboardProps {
  className?: string
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className = '' }) => {
  const [securityStats, setSecurityStats] = useState({
    encryptionEnabled: false,
    keyCount: 0,
    sessionCount: 0,
    totalUsers: 0,
    activeSessions: 0,
    failedAttempts: 0,
    totalMessages: 0,
    totalRooms: 0,
    activeUsers: 0
  })

  const [securityChecks] = useState([
    { name: 'Input Sanitization', status: 'active', description: 'All user inputs are sanitized and validated' },
    { name: 'XSS Protection', status: 'active', description: 'Cross-site scripting attacks are prevented' },
    { name: 'SQL Injection Prevention', status: 'active', description: 'Database injection attacks are blocked' },
    { name: 'Rate Limiting', status: 'active', description: 'DDoS and brute force protection enabled' },
    { name: 'Password Security', status: 'active', description: 'Strong password requirements enforced' },
    { name: 'Session Management', status: 'active', description: 'Secure session handling implemented' },
    { name: 'End-to-End Encryption', status: 'active', description: 'Messages are encrypted with AES-256' },
    { name: 'Digital Signatures', status: 'active', description: 'Message integrity verification enabled' }
  ])

  useEffect(() => {
    loadSecurityStats()
    const interval = setInterval(loadSecurityStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadSecurityStats = () => {
    try {
      const encryptionStatus = encryptionService.getEncryptionStatus()
      const authStats = secureAuthService.getSecurityStats()
      const messagingStats = secureMessagingService.getMessagingStats()

      setSecurityStats({
        encryptionEnabled: encryptionStatus.isEnabled,
        keyCount: encryptionStatus.keyCount,
        sessionCount: encryptionStatus.sessionCount,
        totalUsers: authStats.totalUsers,
        activeSessions: authStats.activeSessions,
        failedAttempts: authStats.failedAttempts,
        totalMessages: messagingStats.totalMessages,
        totalRooms: messagingStats.totalRooms,
        activeUsers: messagingStats.activeUsers
      })
    } catch (error) {
      console.error('Error loading security stats:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Security Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-bold text-gray-900">Security Dashboard</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{securityStats.keyCount}</div>
            <div className="text-sm text-green-700">Encryption Keys</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{securityStats.activeSessions}</div>
            <div className="text-sm text-blue-700">Active Sessions</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{securityStats.totalMessages}</div>
            <div className="text-sm text-purple-700">Encrypted Messages</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{securityStats.failedAttempts}</div>
            <div className="text-sm text-orange-700">Failed Attempts</div>
          </div>
        </div>
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityChecks.map((check, index) => (
            <motion.div
              key={check.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm opacity-75">{check.description}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Enable Two-Factor Authentication</div>
              <div className="text-sm text-blue-700">Add an extra layer of security to your account</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Lock className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-green-900">Use Strong Passwords</div>
              <div className="text-sm text-green-700">Ensure your password meets security requirements</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-purple-900">Regular Security Updates</div>
              <div className="text-sm text-purple-700">Keep your browser and system updated</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Encryption Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Encryption Status</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            securityStats.encryptionEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {securityStats.encryptionEnabled ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{securityStats.keyCount}</div>
            <div className="text-sm text-gray-600">Active Keys</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{securityStats.sessionCount}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{securityStats.totalRooms}</div>
            <div className="text-sm text-gray-600">Encrypted Rooms</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SecurityDashboard
