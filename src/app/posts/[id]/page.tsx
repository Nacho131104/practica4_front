"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById, toggleLikePost, retweetPost, commentPost } from "@/lib/api/conexion";
import { Post } from "@/types/usuario";
import "./post.css";
import { Comment } from "@/types/usuario";
const PostDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPostDetail = async () => {
    try {
      if (typeof id === "string") {
        const data = await getPostById(id);
        setPost(data);
      }
    } catch (error) {
      console.error("Error al cargar el detalle del post", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    try {
      await toggleLikePost(post._id || (post as any).id);
      fetchPostDetail();
    } catch (error) {
      console.error("Error al dar like");
    }
  };

  const handleRetweet = async () => {
    if (!post) return;
    try {
      await retweetPost(post._id || (post as any)._id);
      fetchPostDetail();
    } catch (error) {
      console.error("Error al hacer retweet");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    try {
      await commentPost(post._id || (post as any)._id, newComment);
      setNewComment("");
      fetchPostDetail();
    } catch (error) {
      console.error("Error al publicar comentario");
    }
  };

  if (loading) return <div className="loading"><p>Cargando post...</p></div>;
  if (!post) return <div className="error"><p>Post no encontrado</p></div>;

  return (
    <div className="post-detail-container">
      <button className="back-btn" onClick={() => router.back()}>Volver</button>

      <div className="main-post">
        <div className="post-header">
          <h1>{post.autor?.username || "Usuario"}</h1>
          <p className="date">{post.createdAt}</p>
        </div>

        <div className="post-content">
          <p>{post.contenido}</p>
        </div>

        <div className="post-actions">
          <button onClick={handleLike}>
            Like: {post.likes.length || 0}
          </button>
          <button onClick={handleRetweet}>
            RT: {post.retweets.length || 0}
          </button>
        </div>
      </div>

      <div className="comments-section">
        <h1>Comentarios</h1>
        
        <div className="comment-form-container">
          <input
            type="text"
            placeholder="Escribe tu respuesta..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Responder</button>
        </div>

        <div className="comments-list">
          {post.comentarios && post.comentarios.length > 0 ? (
            post.comentarios.map((comment: Comment) => (
              <div key={comment._id} className="comment-item">
                <h1>{comment.author?.username || "Usuario"}</h1>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="no-comments">
              <p>No hay comentarios aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;