import axios from "axios";
import { AuthResponse, HomeResponse, Post, ProfileResponse } from "@/types/usuario";

const api = axios.create({
  baseURL: "https://backend-p4-klvc.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  config.headers["x-nombre"] = "IGNACIO LOPEZ";

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const sacarToken = (data: any) => {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.jwt ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    data?.user?.token ||
    ""
  );
};

const sacarUser = (data: any) => {
  return data?.user ||  null;
};

const sacarPosts = (data: any) => {
  return data?.posts ||  [];
};

const sacarTotalPages = (data: any) => {
  return data?.totalPages  || 1;
};

const sacarTotalPosts = (data: any) => {
  return data?.totalPosts ||  0;
}

const sacarPage = (data: any) => {
  return data?.page ||  1;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });

  return {
    token: sacarToken(res.data),
    user: sacarUser(res.data),
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/api/auth/login", {
    email,
    password,
  });

  return {
    token: sacarToken(res.data),
    user: sacarUser(res.data),
  };
};

export const getHomePosts = async (page: number): Promise<HomeResponse> => {
  const res = await api.get(`/api/home?page=${page}`);

  return {
    posts: sacarPosts(res.data),
    pagina: sacarPage(res.data),
    totalPaginas: sacarTotalPages(res.data),
    totalPosts: sacarTotalPosts(res.data),
  };
};

export const createPost = async (content: string): Promise<Post> => {
  const res = await api.post("/api/posts", {
    contenido: content,
  });

  return res.data?.post || res.data?.data || res.data;
};
export const getPostById = async (id: string): Promise<Post> => {
  const res = await api.get(`/api/posts/${id}`);
  return res.data?.post || res.data?.data || res.data;
};

export const toggleLikePost = async (id: string) => {
  const res = await api.post(`/api/posts/${id}/like`);
  return res.data;
};

export const retweetPost = async (id: string) => {
  const res = await api.post(`/api/posts/${id}/retweet`);
  return res.data;
};

export const commentPost = async (id: string, content: string) => {
  const res = await api.post(`/api/posts/${id}/comment`, { content });
  return res.data;
};

export const getMyProfile = async (): Promise<ProfileResponse> => {
  const res = await api.get("/api/users/me");

  return {
    user: res.data?.user,
    posts: res.data?.posts|| [],
  };
};

export default api;