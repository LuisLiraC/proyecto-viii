import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");

  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    await signIn({ email, password });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!email || !password || !name || !username) {
      return;
    }

    // verify username is available
    const res = await fetch('/api/v1/auth/username_available', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!data.is_available) {
      alert("El nombre de usuario no está disponible");
      return;
    }

    await signUp({ email, password, name, username });
  };

  return (
    <div>
      <div>
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
      <div>
        <h1>Registrarse</h1>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
          <div>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUserName(e.target.value.trim())}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}
