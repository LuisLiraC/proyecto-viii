import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar/>
      <div className="Container Content">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

