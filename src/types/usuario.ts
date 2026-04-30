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
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  retweetsCount: number;
  likedByMe?: boolean;
  retweetedByMe?: boolean;
  author: User;
  comments?: Comment[];
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