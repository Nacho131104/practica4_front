"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHomePosts, createPost, toggleLikePost, retweetPost } from "@/lib/api/conexion";
import { Post } from "@/types/usuario";
import "./page.css";

const Home = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    // Redirigir al login si no hay token (proxy del front)
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
      setTotalPages(data.totalPages);
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
      fetchPosts(); // Recargamos el feed para ver el nuevo post
    } catch (error) {
      console.error("Error al publicar", error);
    }
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic te lleve al detalle del post
    try {
      await toggleLikePost(id);
      fetchPosts(); // Refrescamos para obtener el nuevo conteo de likes
    } catch (error) {
      console.error("Error al dar like", error);
    }
  };

  const handleRetweet = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    try {
      await retweetPost(id);
      fetchPosts(); // Refrescamos para obtener el nuevo conteo de RTs
    } catch (error) {
      console.error("Error al hacer retweet", error);
    }
  };

  return (
    <div className="page">
      {/* Formulario de creación */}
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
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="post-card" 
            onClick={() => router.push(`/post/${post.id}`)}
            style={{ cursor: "pointer", border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
          >
            <h4>{post.author?.username || "Usuario anónimo"}</h4>
            <p>{post.content}</p>
            
            <div className="actions">
              <button onClick={(e) => handleLike(post.id, e)}>
                {post.likedByMe ? "like": "not liked"} {post.likesCount}
              </button>
              <button onClick={(e) => handleRetweet(post.id, e)}>
                {post.retweetedByMe ? "(RT)" : "not RT"} {post.retweetsCount}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
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