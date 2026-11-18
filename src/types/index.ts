export type Role = 'USER' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export type UserSummary = Pick<User, '_id' | 'name' | 'email'>;

export interface Note {
  _id: string;
  user: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNote extends Omit<Note, 'user'> {
  user: UserSummary;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface InterestGroup {
  interest: string;
  count: number;
  users: UserSummary[];
}

export interface UserPosts {
  user: Pick<User, '_id' | 'name'>;
  posts: Post[];
}
