"use client";
import { useRouter } from "next/navigation";
import { toggleLikePost, retweetPost } from "@/lib/api/conexion";

const PostCard = ({ post, refrescar }: any) =>{
  const router = useRouter();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLikePost(post._id);
      if (refrescar) refrescar();
    } catch (err) {
      console.log("Error en like", err);
    }
  };

  const handleRetweet = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await retweetPost(post._id);
      if (refrescar) refrescar();
    } catch (err) {
      console.log("Error en RT", err);
    }
  };

  return (
    <div className="post-card" onClick={() => router.push("/posts/" + post._id)}>
      <div className="post-header">
        <h1>{post.autor?.username || "Usuario"}</h1>
      </div>
      
      <div className="post-body">
        <p>{post.contenido}</p>
      </div>

      <div className="post-actions">
        <button onClick={handleLike}>
          ❤️ {post.likes?.length || 0}
        </button>
        <button onClick={handleRetweet}>
          🔁 {post.retweets?.length || 0}
        </button>
        {/* Botón visual para comentarios */}
        <button>
          💬 {post.comentarios?.length || 0}
        </button>
      </div>
    </div>
  );
}

export default PostCard;