"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api/conexion";

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
    <section className="authSection">
      <div className="authCard">
        <h2>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h2>

        <form onSubmit={handleSubmit} className="authForm">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{isLogin ? "Entrar" : "Registrarme"}</button>
        </form>

        <button
          className="secondaryButton"
          onClick={() => {
            setIsLogin(!isLogin);
            setUsername("");
            setEmail("");
            setPassword("");
          }}
        >
          {isLogin ? "Crear cuenta nueva" : "Ya tengo cuenta"}
        </button>
      </div>
    </section>
  );
};

export default LoginPage;