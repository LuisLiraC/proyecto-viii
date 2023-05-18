import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();
  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    await signIn({ email, password });
  };


  return (
    <div className="SignFormContainer">
      <h1 className="FormTitle">Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
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
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="SubmitButton">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default SignInForm;
