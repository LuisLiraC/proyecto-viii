import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");

  const { signUp } = useAuth();

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
    <div className="SignFormContainer">
      <h1 className="FormTitle">Registrarse</h1>
      <form onSubmit={handleRegister}>
        <div className="FormElement">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
          />
        </div>
        <div className="FormElement">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>
        <div className="FormElement">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUserName(e.target.value.trim())}
          />
        </div>
        <div className="FormElement">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="SubmitButton">Registrarse</button>
      </form>
    </div>
  );
}

export default SignUpForm;
