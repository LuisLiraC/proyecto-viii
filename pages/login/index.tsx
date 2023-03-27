import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { signIn } = useAuth();

  return (
    <div>
      <button onClick={signIn}>
        Login
      </button>
    </div>
  );
}
