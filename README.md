# BookNerdSociety - Professional Platform

A modern, full-stack book club platform built with React, Node.js, and TypeScript. This is a complete rewrite of the original LeftOnRead project with professional architecture and best practices.

## 🚀 Features

- **Modern React Frontend**: Built with React 18, TypeScript, and Vite
- **Node.js Backend**: Express.js API with TypeScript
- **Real-time Features**: Socket.io for live chat and notifications
- **Authentication**: JWT-based auth with secure sessions
- **Database**: MongoDB with Mongoose ODM
- **Responsive Design**: Tailwind CSS with custom components
- **State Management**: Zustand for client-side state
- **API Integration**: Google Books API for book data
- **Real-time Chat**: Secure end-to-end encrypted messaging
- **Book Clubs**: Join, create, and manage book clubs
- **Social Features**: Friends, recommendations, and reviews

## 🏗️ Architecture

```
LeftOnRead-Pro/
├── apps/
│   ├── frontend/          # React + TypeScript frontend
│   └── backend/           # Node.js + Express backend
├── packages/              # Shared packages (future)
└── shared/               # Shared types and utilities
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for server state
- **Zustand** for client state
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **Socket.io** for real-time features
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limit** for security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB (local or cloud)

### Installation

1. **Clone and setup**
```bash
cd /Users/jayson/Downloads/LeftOnRead-Pro
npm run install:all
```

2. **Environment Setup**
```bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env
# Edit the .env file with your configuration
```

3. **Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

## 📁 Project Structure

### Frontend (`apps/frontend/`)
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── stores/             # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utility functions
└── main.tsx           # App entry point
```

### Backend (`apps/backend/`)
```
src/
├── controllers/        # Route controllers
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Express middleware
├── services/          # Business logic
├── utils/             # Utility functions
├── types/             # TypeScript types
└── server.ts          # Server entry point
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build both apps
npm run build:frontend    # Build only frontend
npm run build:backend    # Build only backend

# Installation
npm run install:all      # Install all dependencies
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (`apps/backend/.env`)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leftonread
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

**Frontend (`apps/frontend/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

## 🎨 Design System

The platform uses a modern design system with:
- **Glassmorphism effects** for modern UI
- **Gradient backgrounds** and text
- **Smooth animations** with Framer Motion
- **Responsive design** for all devices
- **Dark/light theme** support (future)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization

## 📱 Features

### User Features
- User registration and authentication
- Profile management
- Book search and discovery
- Personal book collections
- Friend connections
- Book reviews and ratings

### Book Club Features
- Create and join book clubs
- Real-time chat with encryption
- Member management
- Club settings and permissions
- Book discussions and polls

### Social Features
- Friend recommendations
- Activity feeds
- Book sharing
- Reading challenges
- Community discussions

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd apps/frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd apps/backend
npm run build
# Deploy with environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ for book lovers everywhere**
