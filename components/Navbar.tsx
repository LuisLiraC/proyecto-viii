import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Navbar() {
  const { isLogged, signOut } = useAuth();

  return (
    <nav className="Navbar">
      <ul className="Container Navbar--List">
        <li className="Navbar--List--Item">
          <Link
            className="List--Item--Link"
            href="/"
            id="home"
          >
            Inicio
          </Link>
        </li>
        {isLogged ? (
          <>
            <li className="Navbar--List--Item">
              <Link
                className="List--Item--Link"
                href="/profile"
                id="profile"
              >
                Mi perfil
              </Link>
            </li>
            <li className="Navbar--List--Item">
              <a
                className="List--Item--Logout"
                onClick={signOut}
                href="#"
                id="logout"
              >
                Cerrar sesión
              </a>
            </li>
          </>
        ) : (
          <li className="Navbar--List--Item">
            <Link
              className="List--Item--Button"
              href="/login"
              id="login"
            >
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
