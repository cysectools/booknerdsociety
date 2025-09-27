import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Edit3, BookOpen, Star, Calendar, Settings, Shield, Trash2, Eye, EyeOff, Phone, Mail, AlertTriangle } from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import Tutorial from '../components/Tutorial'
import SecurityDashboard from '../components/SecurityDashboard'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'phone'>('email')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const { 
    profile, 
    isTutorialCompleted, 
    isLoading,
    loadUser,
    updateProfile, 
    toggleProfileVisibility, 
    enableTwoFactor, 
    deleteAccount
  } = useUserStore()

  const [editData, setEditData] = useState(profile)

  useEffect(() => {
    setEditData(profile)
  }, [profile])

  useEffect(() => {
    // Load user data from database
    loadUser('1')
  }, [loadUser])

  useEffect(() => {
    // Show tutorial for new users
    if (!isTutorialCompleted) {
      setShowTutorial(true)
    }
  }, [isTutorialCompleted])

  const handleSave = () => {
    updateProfile(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(profile)
    setIsEditing(false)
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDeleteModal(false)
  }

  const handleEnableTwoFactor = () => {
    enableTwoFactor(twoFactorMethod, phoneNumber)
    setShowTwoFactorModal(false)
    setPhoneNumber('')
  }

  // const handleDisableTwoFactor = () => {
  //   disableTwoFactor()
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-2xl p-8 mb-8"
          data-tutorial="profile-section"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Edit3 className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Tutorial
                  </button>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Username"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Bio"
                    rows={3}
                  />
                  <div className="flex gap-4">
                    <button onClick={handleSave} className="btn-primary">
                      Save Changes
                    </button>
                    <button onClick={handleCancel} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">{profile.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {profile.booksRead} books read
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {profile.averageRating.toFixed(1)} avg rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(profile.memberSince).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card text-center"
          >
            <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">{profile.booksRead}</h3>
            <p className="text-gray-600">Books Read</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card text-center"
          >
            <Star className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">{profile.averageRating.toFixed(1)}</h3>
            <p className="text-gray-600">Average Rating</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card text-center"
          >
            <User className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">{profile.bookClubs}</h3>
            <p className="text-gray-600">Book Clubs</p>
          </motion.div>
        </div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary-600" />
            Account Settings
          </h2>
          
          <div className="space-y-6">
            {/* Profile Visibility */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {profile.isPublic ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-gray-600" />}
                <div>
                  <h3 className="font-semibold">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">
                    {profile.isPublic ? 'Your profile is public' : 'Your profile is private'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleProfileVisibility}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  profile.isPublic 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {profile.isPublic ? 'Public' : 'Private'}
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className={`h-5 w-5 ${profile.twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                <div>
                  <h3 className="font-semibold">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    {profile.twoFactorEnabled 
                      ? `Enabled via ${profile.twoFactorMethod}` 
                      : 'Add an extra layer of security'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTwoFactorModal(true)}
                className="btn-primary"
              >
                {profile.twoFactorEnabled ? 'Manage' : 'Enable'}
              </button>
            </div>

            {/* Tutorial */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-semibold">Interactive Tutorial</h3>
                  <p className="text-sm text-gray-600">
                    Learn how to navigate the app safely
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTutorial(true)}
                className="btn-secondary"
              >
                Start Tutorial
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-700">Delete Account</h3>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tutorial Modal */}
        <Tutorial
          isVisible={showTutorial}
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />

        {/* Delete Account Modal */}
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
              <div className="text-center mb-6">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-700 mb-2">Delete Account</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteAccount}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Two-Factor Authentication Modal */}
        {showTwoFactorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTwoFactorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-effect max-w-md w-full rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600">
                  Choose your preferred method for two-factor authentication
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="email-2fa"
                    name="2fa-method"
                    value="email"
                    checked={twoFactorMethod === 'email'}
                    onChange={(e) => setTwoFactorMethod(e.target.value as 'email')}
                    className="text-primary-600"
                  />
                  <label htmlFor="email-2fa" className="flex items-center gap-3 cursor-pointer">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-600">Send codes to your email</div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="phone-2fa"
                    name="2fa-method"
                    value="phone"
                    checked={twoFactorMethod === 'phone'}
                    onChange={(e) => setTwoFactorMethod(e.target.value as 'phone')}
                    className="text-primary-600"
                  />
                  <label htmlFor="phone-2fa" className="flex items-center gap-3 cursor-pointer">
                    <Phone className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="font-medium">Phone Number</div>
                      <div className="text-sm text-gray-600">Send codes via SMS</div>
                    </div>
                  </label>
                </div>
                
                {twoFactorMethod === 'phone' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowTwoFactorModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleEnableTwoFactor}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-primary"
                  disabled={twoFactorMethod === 'phone' && !phoneNumber}
                >
                  {profile.twoFactorEnabled ? 'Update' : 'Enable'} 2FA
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Security Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <SecurityDashboard />
        </motion.div>
      </div>
    </div>
  )
}
