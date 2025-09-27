import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, BookOpen, Star, Calendar, User, Globe } from 'lucide-react'
import { booksService } from '../services/booksService'
import { Book } from '../types'
import { useBooksStore } from '../stores/booksStore'

export default function BookSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  const { addToWishlist, addToReadingList } = useBooksStore()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setShowResults(true)
    
    try {
      const books = await booksService.searchBooks(searchQuery, 10)
      setSearchResults(books)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBook(null)
  }

  const handleAddToWishlist = (book: Book) => {
    addToWishlist(book)
    console.log('Added to wishlist:', book.title)
    // TODO: Add toast notification here
  }

  const handleAddToReadingList = (book: Book) => {
    addToReadingList(book)
    console.log('Added to reading list:', book.title)
    // TODO: Add toast notification here
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="btn-primary flex items-center gap-2"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 right-0 mt-4 glass-effect rounded-2xl p-6 z-10 max-h-96 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Search Results</h3>
            <button
              onClick={() => setShowResults(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No books found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((book, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="w-12 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={book.cover || '/placeholder-book.jpg'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold line-clamp-1">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{book.rating || '4.5'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Book Details Modal */}
      {showModal && selectedBook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <img
                  src={selectedBook.cover || '/placeholder-book.jpg'}
                  alt={selectedBook.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Book Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{selectedBook.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{selectedBook.rating || 'N/A'}</span>
                  <span className="text-gray-500">({selectedBook.rating ? 'Rating' : 'No rating available'})</span>
                </div>

                {/* Book Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Published: {selectedBook.year || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedBook.pages || 'Unknown'} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Genre: {selectedBook.genre || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Language: {selectedBook.language || 'Unknown'}</span>
                  </div>
                </div>

                {/* Description */}
                {selectedBook.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedBook.description.length > 300 
                        ? `${selectedBook.description.substring(0, 300)}...` 
                        : selectedBook.description
                      }
                    </p>
                  </div>
                )}

                {/* Publisher */}
                {selectedBook.publisher && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Publisher</h3>
                    <p className="text-gray-700">{selectedBook.publisher}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <motion.button 
                    onClick={() => handleAddToWishlist(selectedBook)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Add to Wishlist
                  </motion.button>
                  <motion.button 
                    onClick={() => handleAddToReadingList(selectedBook)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Add to Reading List
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
