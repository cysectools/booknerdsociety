import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, MessageCircle, Settings, MoreVertical, Crown, Shield, Trash2, UserPlus, UserMinus, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import SecureMessaging from '../components/SecureMessaging'

export default function Club() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { } = useAuthStore()
  const [activeTab, setActiveTab] = useState('chat')
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isModerator, setIsModerator] = useState(false)

  const [club, setClub] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Mock club data - in a real app, this would come from an API
  const mockClubs = {
    'booknerdsociety': {
      id: 'booknerdsociety',
      name: 'BookNerdSociety',
      description: 'The official BookNerdSociety club for all book lovers! Join discussions, share recommendations, and discover your next favorite read.',
      memberCount: 1,
      maxMembers: 1000,
      currentBook: 'The Great Gatsby',
      icon: '📚',
      owner: 'system',
      isOfficial: true,
      rating: 4.9,
      isJoined: true,
      rules: [
        'Be respectful to all members',
        'Keep discussions book-related',
        'No spam or self-promotion',
        'Share your honest opinions'
      ]
    },
    '1': {
      id: 1,
      name: 'Fantasy Readers',
      description: 'A community for fantasy book lovers to discuss magical worlds and epic adventures.',
      memberCount: 156,
      maxMembers: 200,
      currentBook: 'The Name of the Wind',
      icon: '🧙‍♂️',
      owner: 'BookLover123',
      isOfficial: false,
      rating: 4.8,
      isJoined: true,
      rules: [
        'Be respectful to all members',
        'Keep discussions book-related',
        'No spam or self-promotion',
        'Share your honest opinions'
      ]
    },
    '2': {
      id: 2,
      name: 'Sci-Fi Enthusiasts',
      description: 'Explore the vast universe of science fiction literature with fellow sci-fi lovers.',
      memberCount: 89,
      maxMembers: 150,
      currentBook: 'Dune',
      icon: '🚀',
      owner: 'SciFiFan',
      isOfficial: false,
      rating: 4.7,
      isJoined: false,
      rules: [
        'Be respectful to all members',
        'Keep discussions book-related',
        'No spam or self-promotion',
        'Share your honest opinions'
      ]
    },
    '3': {
      id: 3,
      name: 'Mystery & Thriller',
      description: 'Dive into the world of mystery novels and psychological thrillers.',
      memberCount: 203,
      maxMembers: 250,
      currentBook: 'Gone Girl',
      icon: '🔍',
      owner: 'MysteryLover',
      isOfficial: false,
      rating: 4.6,
      isJoined: true,
      rules: [
        'Be respectful to all members',
        'Keep discussions book-related',
        'No spam or self-promotion',
        'Share your honest opinions'
      ]
    },
    '4': {
      id: 4,
      name: 'Romance Readers',
      description: 'A cozy community for romance novel enthusiasts to share their favorite love stories.',
      memberCount: 127,
      maxMembers: 180,
      currentBook: 'The Seven Husbands of Evelyn Hugo',
      icon: '💕',
      owner: 'RomanceReader',
      isOfficial: false,
      rating: 4.5,
      isJoined: false,
      rules: [
        'Be respectful to all members',
        'Keep discussions book-related',
        'No spam or self-promotion',
        'Share your honest opinions'
      ]
    }
  }

  // Load club data based on ID
  useEffect(() => {
    const loadClubData = () => {
      setLoading(true)
      
      // Simulate API call delay
      setTimeout(() => {
        const clubData = mockClubs[id as keyof typeof mockClubs]
        
        if (clubData) {
          setClub(clubData)
          // Set owner status based on club data
          // In a real app, this would check against the current user
          const isCurrentUserOwner = clubData.owner === 'system' || clubData.owner === 'BookLover123'
          setIsOwner(isCurrentUserOwner)
          setIsModerator(false) // For now, no moderators in mock data
        } else {
          // Club not found - redirect back to clubs
          navigate('/clubs')
          return
        }
        
        setLoading(false)
      }, 500) // Simulate loading delay
    }

    if (id) {
      loadClubData()
    }
  }, [id, navigate])

  const [members, setMembers] = useState<any[]>([])

  // Generate members based on club
  useEffect(() => {
    if (club) {
      const generateMembers = () => {
        const baseMembers = [
          { id: 1, username: club.owner, role: 'Owner', isOnline: true },
          { id: 2, username: 'FantasyFan', role: 'Member', isOnline: true },
          { id: 3, username: 'MagicReader', role: 'Member', isOnline: false },
          { id: 4, username: 'DragonLover', role: 'Member', isOnline: true }
        ]

        // Add more members based on club size
        const additionalMembers = []
        for (let i = 5; i <= Math.min(club.memberCount, 10); i++) {
          additionalMembers.push({
            id: i,
            username: `Member${i}`,
            role: 'Member',
            isOnline: Math.random() > 0.3
          })
        }

        setMembers([...baseMembers, ...additionalMembers])
      }

      generateMembers()
    }
  }, [club])


  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]


  const handleLeaveClub = () => {
    // TODO: Implement leave club
    console.log('Leaving club:', club.id)
    setShowLeaveModal(false)
    navigate('/clubs')
  }

  const handleDeleteClub = () => {
    // TODO: Implement delete club
    console.log('Deleting club:', club.id)
    setShowDeleteModal(false)
    navigate('/clubs')
  }

  const handleKickMember = (memberId: number) => {
    // TODO: Implement kick member
    console.log('Kicking member:', memberId)
  }

  const handlePromoteMember = (memberId: number) => {
    // TODO: Implement promote member
    console.log('Promoting member:', memberId)
  }

  const canManageClub = isOwner || isModerator

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Loading Club...</h3>
              <p className="text-gray-500">Fetching club data and members</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show error state if club not found
  if (!club) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Club Not Found</h3>
            <p className="text-gray-500 mb-6">The club you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/clubs')}
              className="btn-primary"
            >
              Back to Clubs
            </button>
          </motion.div>
        </div>
      </div>
    )
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{club.name}</h1>
                {club.isOfficial && (
                  <span className="px-3 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full">
                    Official
                  </span>
                )}
                {isOwner && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Owner
                  </span>
                )}
                {isModerator && !isOwner && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Moderator
                  </span>
                )}
              </div>
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
              {!isOwner && (
                <button className="btn-primary">Join Club</button>
              )}
              {isOwner && (
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              )}
              <div className="relative">
                <button className="glass-effect p-3 rounded-xl hover:scale-105 transition-all duration-300">
                  <MoreVertical className="h-5 w-5" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
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
            <div className="h-[500px]">
              <SecureMessaging
                roomId={id}
                currentUserId="current_user"
                className="h-full"
              />
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Members ({members.length})</h3>
                {canManageClub && (
                  <button className="btn-primary flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Members
                  </button>
                )}
              </div>
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.username}</h3>
                          {member.role === 'Owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                          {member.role === 'Moderator' && <Shield className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      {canManageClub && member.role !== 'Owner' && (
                        <div className="flex gap-1">
                          {member.role === 'Member' && (
                            <button
                              onClick={() => handlePromoteMember(member.id)}
                              className="p-2 hover:bg-blue-100 rounded-full transition-colors text-blue-600"
                              title="Promote to Moderator"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleKickMember(member.id)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-600"
                            title="Remove Member"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
            <div className="space-y-6">
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Club Settings</h3>
                <p className="text-gray-500">Only the club owner can modify club settings</p>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4 text-red-600">Member Actions</h4>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="w-full flex items-center gap-3 p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                >
                  <UserMinus className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Leave Club</div>
                    <div className="text-sm">Leave this club and lose access to discussions</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Leave Club Modal */}
        <AnimatePresence>
          {showLeaveModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowLeaveModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-effect max-w-md w-full rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Leave Club</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to leave "{club.name}"? You'll lose access to all club discussions and activities.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLeaveClub}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    Leave Club
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Club Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-effect max-w-md w-full rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold">Delete Club</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to permanently delete "{club.name}"? This action cannot be undone and all club data will be lost.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteClub}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    Delete Club
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettingsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowSettingsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Club Settings</h3>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Book
                    </label>
                    <input
                      type="text"
                      defaultValue={club.currentBook}
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

                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowSettingsModal(false)
                          setShowDeleteModal(true)
                        }}
                        className="w-full flex items-center gap-3 p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Delete Club</div>
                          <div className="text-sm">Permanently delete this club and all its data</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 btn-primary">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
