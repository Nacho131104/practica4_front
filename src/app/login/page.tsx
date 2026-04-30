"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api/conexion";
import "./auth.css"
const LoginPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let data;

      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(username, email, password);
      }

      if (!data.token) {
        alert("No se ha recibido token");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/");
    } catch (error: any) {
      console.log(error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "No se ha podido iniciar sesión o registrar"
      );
    }
  };

    return (
    <div className="authSection">
        <h1 className="logo-text">Nebrija<span>Social</span></h1>

        <div className="authCard">
        <form onSubmit={handleSubmit} className="authForm">
            {!isLogin && (
            <div>
                <p>Usuario</p>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            )}

            <p>Email</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <p>Contraseña</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit">{isLogin ? "Entrar" : "Registrarme"}</button>
        </form>

        <button className="secondaryButton" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Crear cuenta nueva" : "Ya tengo cuenta"}
        </button>
        </div>
    </div>
    );
};

export default LoginPage;