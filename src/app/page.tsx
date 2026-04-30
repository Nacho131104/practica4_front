"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHomePosts, createPost, toggleLikePost, retweetPost } from "@/lib/api/conexion";
import { Post } from "@/types/usuario";
import PostCard from "@/app/components/postCard";
import "./page.css";

const Home = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      router.push("/login");
      return;
    }
    fetchPosts();
  }, [page, router]);

  const fetchPosts = async () => {
    try {
      const data = await getHomePosts(page);
      setPosts(data.posts);
      setTotalPages(data.totalPaginas);
    } catch (error) {
      console.error("Error al cargar el feed", error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await createPost(newPostContent);
      setNewPostContent("");
      fetchPosts(); 
    } catch (error) {
      console.error("Error al publicar", error);
    }
  };

  return (
    <div className="page">
      {/* Postear */}
      <div className="create-post">
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="¿Qué está pasando?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            required
          />
          <button type="submit">Postear</button>
        </form>
      </div>

      {/* Feed de Posts */}
      <div className="feed">
        {posts.map((post: any) => (
          <PostCard 
            key={post._id} 
            post={post} 
            refrescar={fetchPosts} 
          />
        ))}
      </div>
      <div className="pagination" >
        <button 
          disabled={page <= 1} 
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>
        <p>Página {page} de {totalPages}</p>
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Home;