import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Users, MessageCircle, Settings, Send, MoreVertical, Star } from 'lucide-react'

export default function Club() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('chat')
  const [message, setMessage] = useState('')
  const [isOwner] = useState(true) // This would come from props/context

  const [club] = useState({
    id: id || '1',
    name: 'Fantasy Readers',
    description: 'A community for fantasy book lovers to discuss magical worlds and epic adventures.',
    memberCount: 156,
    maxMembers: 200,
    currentBook: 'The Name of the Wind',
    icon: '🧙‍♂️',
    owner: 'BookLover123'
  })

  const [members] = useState([
    { id: 1, username: 'BookLover123', role: 'Owner', isOnline: true },
    { id: 2, username: 'FantasyFan', role: 'Member', isOnline: true },
    { id: 3, username: 'MagicReader', role: 'Member', isOnline: false },
    { id: 4, username: 'DragonLover', role: 'Member', isOnline: true }
  ])

  const [messages] = useState([
    { id: 1, username: 'BookLover123', content: 'Welcome to our book club!', timestamp: '2 hours ago' },
    { id: 2, username: 'FantasyFan', content: 'Excited to discuss The Name of the Wind!', timestamp: '1 hour ago' },
    { id: 3, username: 'MagicReader', content: 'This book is amazing so far!', timestamp: '30 minutes ago' }
  ])

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // TODO: Implement send message
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Club Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="text-6xl">{club.icon}</div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
              <p className="text-gray-600 mb-4">{club.description}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {club.memberCount}/{club.maxMembers} members
                </span>
                <span>Currently reading: {club.currentBook}</span>
                <span>Owner: {club.owner}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary">Join Club</button>
              <button className="glass-effect p-3 rounded-xl hover:scale-105 transition-all duration-300">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'glass-effect hover:scale-105'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-effect rounded-2xl p-6"
        >
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {msg.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{msg.username}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="card">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.username}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && isOwner && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Club Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Club Name
                    </label>
                    <input
                      type="text"
                      defaultValue={club.name}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      defaultValue={club.description}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Members
                    </label>
                    <input
                      type="number"
                      defaultValue={club.maxMembers}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="btn-primary">Save Changes</button>
                  <button className="btn-secondary">Delete Club</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && !isOwner && (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Access Denied</h3>
              <p className="text-gray-500">Only the club owner can access settings</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
