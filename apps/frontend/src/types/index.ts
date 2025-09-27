export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  currentBook?: string;
  booksReadThisYear?: number;
  favoriteGenre?: string;
  activeClubs?: string[];
  friends?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authors?: string[];
  genre: string;
  genres?: string[];
  year: string;
  cover: string;
  description?: string;
  isbn?: string;
  rating?: number;
  pages?: number;
  language?: string;
  publisher?: string;
}

export interface BookClub {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  maxMembers?: number;
  status?: 'active' | 'inactive' | 'private';
  ownerId: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
  currentBook?: any;
  owner?: string;
  isOfficial?: boolean;
  rating?: number;
  isJoined?: boolean;
  rules?: string[];
  isPublic?: boolean;
  createdBy?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  clubId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isEncrypted: boolean;
}

export interface Friend {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  booksRead: number;
  favoriteGenre?: string;
  lastActive?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  wishlist: Book[];
  bookmarks: Book[];
  friends: Friend[];
  activeClubs: BookClub[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
