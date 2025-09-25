import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Edit3, BookOpen, Star, Calendar, Settings } from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({
    username: 'BookLover123',
    email: 'user@example.com',
    bio: 'Passionate reader and book club enthusiast. Love discovering new authors and sharing recommendations!',
    avatar: '',
    booksRead: 47,
    favoriteGenre: 'Fantasy',
    memberSince: '2023-01-15'
  })

  const [editData, setEditData] = useState(user)

  const handleSave = () => {
    setUser(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(user)
    setIsEditing(false)
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
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Edit3 className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
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
                  <p className="text-gray-600 mb-4">{user.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {user.booksRead} books read
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {user.favoriteGenre}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(user.memberSince).toLocaleDateString()}
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
            <h3 className="text-2xl font-bold mb-1">{user.booksRead}</h3>
            <p className="text-gray-600">Books Read</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card text-center"
          >
            <Star className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card text-center"
          >
            <User className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">12</h3>
            <p className="text-gray-600">Book Clubs</p>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold">Finished reading "The Great Gatsby"</p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Rated "1984" 5 stars</p>
                <p className="text-sm text-gray-600">1 week ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Joined "Fantasy Readers" book club</p>
                <p className="text-sm text-gray-600">2 weeks ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
