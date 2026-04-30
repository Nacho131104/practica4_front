export type User = {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
};

export type Post = {
  _id: string;
  contenido: string;
  autor: User;
  likes: string[];
  retweets: { usuario: string; fecha: string }[];
  comentarios: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type HomeResponse = {
  posts: Post[];
  page: number;
  totalPages: number;
};

export type AuthResponse = {
  token: string;
  user?: User | null;
};

export type ProfileResponse = {
  user: User;
  posts: Post[];
  page?: number;
  totalPages?: number;
};