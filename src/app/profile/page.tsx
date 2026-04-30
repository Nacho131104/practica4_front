"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/api/conexion"; 
import { Post, User } from "@/types/usuario";
import PostCard from "../components/postCard";
import "./profile.css"; 

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setUser(data.user);
      setPosts(data.posts || []);
    } catch (error) {
  
      router.push("/login");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!user) return null;

  return (
    <main className="profile-container">
      <header className="profile-header">
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="email">{user.email}</p>
          {user.bio && <p className="bio">{user.bio}</p>}
        </div>
        
        <div className="profile-stats">
          <div className="stat">
            <span>{posts.length}</span>
            <label>Posts</label>
          </div>
          <div className="stat">
            <span>{user.followersCount ?? 0}</span>
            <label>Seguidores</label>
          </div>
          <div className="stat">
            <span>{user.followingCount ?? 0}</span>
            <label>Siguiendo</label>
          </div>
        </div>
      </header>

      <section className="profile-content">
        <h2 className="section-title">Publicaciones</h2>
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                refreshPosts={fetchProfile} 
              />
            ))
          ) : (
            <p className="empty-msg">Aún no has publicado nada.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;