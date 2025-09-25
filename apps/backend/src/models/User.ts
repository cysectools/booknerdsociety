import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  bio?: string
  avatar?: string
  currentBook?: string
  booksReadThisYear?: number
  favoriteGenre?: string
  activeClubs?: mongoose.Types.ObjectId[]
  friends?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  currentBook: {
    type: String,
    default: ''
  },
  booksReadThisYear: {
    type: Number,
    default: 0
  },
  favoriteGenre: {
    type: String,
    default: ''
  },
  activeClubs: [{
    type: Schema.Types.ObjectId,
    ref: 'BookClub'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

// Index for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)
