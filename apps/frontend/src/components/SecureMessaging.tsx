import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Lock, Shield, Eye, AlertTriangle } from 'lucide-react'
import { secureMessagingService } from '../services/secureMessagingService'
import SecureInput from './SecureInput'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: number
  encrypted: boolean
  delivered: boolean
  read: boolean
}

interface SecureMessagingProps {
  roomId?: string
  currentUserId: string
  recipientId?: string
  className?: string
}

const SecureMessaging: React.FC<SecureMessagingProps> = ({
  roomId,
  currentUserId,
  recipientId,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'encrypting'>('connected')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages
  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 2000) // Poll for new messages
    return () => clearInterval(interval)
  }, [roomId, recipientId])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const loadedMessages = secureMessagingService.getMessages(currentUserId, roomId)
      // Convert SecureMessage to Message format
      const convertedMessages: Message[] = loadedMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        timestamp: msg.timestamp,
        encrypted: msg.encrypted,
        delivered: true, // Default to delivered
        read: false // Default to unread
      }))
      setMessages(convertedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageContent = newMessage.trim()
    setNewMessage('') // Clear input immediately for better UX

    try {
      setConnectionStatus('encrypting')
      
      // Simulate a small delay for encryption
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = secureMessagingService.sendMessage(
        messageContent,
        recipientId || roomId || '',
        currentUserId,
        roomId
      )

      if (result.success) {
        // Reload messages to show the new one
        await loadMessages()
        setConnectionStatus('connected')
        
        // Scroll to bottom after new message
        setTimeout(() => {
          scrollToBottom()
        }, 200)
      } else {
        setConnectionStatus('disconnected')
        // Restore message if sending failed
        setNewMessage(messageContent)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setConnectionStatus('disconnected')
      // Restore message if sending failed
      setNewMessage(messageContent)
    }
  }

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }


  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500'
      case 'encrypting': return 'text-yellow-500'
      case 'disconnected': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Shield className="h-4 w-4" />
      case 'encrypting': return <Lock className="h-4 w-4 animate-spin" />
      case 'disconnected': return <AlertTriangle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {roomId ? 'Secure Group Chat' : 'Secure Direct Message'}
            </h3>
            <p className="text-sm text-gray-600">
              End-to-end encrypted messaging
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </button>
            
            <div className={`flex items-center gap-1 ${getConnectionStatusColor()}`}>
              {getConnectionStatusIcon()}
              <span className="text-sm font-medium capitalize">
                {connectionStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <AnimatePresence>
          {showSecurityInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center gap-2 text-blue-800">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Security Features</span>
              </div>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Messages are encrypted with AES-256</li>
                <li>• Digital signatures prevent tampering</li>
                <li>• Perfect forward secrecy</li>
                <li>• No message content stored on servers</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Lock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No messages yet. Start a secure conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === currentUserId
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.encrypted && (
                    <Lock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {message.delivered && (
                      <div className="w-1 h-1 bg-current rounded-full" />
                    )}
                    {message.read && (
                      <div className="w-1 h-1 bg-current rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <SecureInput
              type="textarea"
              value={newMessage}
              onChange={setNewMessage}
              onKeyPress={handleKeyPress}
              placeholder="Type your secure message..."
              maxLength={1000}
              showSecurityIndicator={false}
              className="resize-none"
            />
          </div>
          
          <motion.button
            onClick={sendMessage}
            disabled={!newMessage.trim() || connectionStatus === 'encrypting'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>
            {newMessage.length}/1000 characters
          </span>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecureMessaging
