import { BookOpen, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8" />
              <span className="text-2xl font-bold">BookNerdSociety</span>
            </div>
            <p className="text-primary-200 mb-4">
              Connect with fellow book lovers, discover new reads, and join vibrant book clubs. 
              Your literary journey starts here.
            </p>
            <p className="text-primary-300 text-sm">
              Made with <Heart className="inline h-4 w-4 text-red-400" /> for book enthusiasts
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-primary-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="/books" className="text-primary-200 hover:text-white transition-colors">Books</a></li>
              <li><a href="/clubs" className="text-primary-200 hover:text-white transition-colors">Clubs</a></li>
              <li><a href="/friends" className="text-primary-200 hover:text-white transition-colors">Friends</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-primary-200 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-primary-200 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="text-primary-200 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-primary-200 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center">
          <p className="text-primary-300">
            &copy; 2025 BookNerdSociety. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
