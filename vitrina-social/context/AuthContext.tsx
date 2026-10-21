"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { API_URL } from "@/const/api";
import Cookies from "js-cookie";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role?: { name: string };
}

interface AuthContextType {
  user: AuthUser | null;
  jwt: string | null;
  loading: boolean;
  login: (jwt: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  jwt: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para validar token
  const verifySession = async () => {
    const storedJwt = Cookies.get("jwt_token") || localStorage.getItem("jwt");

    if (!storedJwt) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${storedJwt}` },
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("Usuario verificado:", userData);
        setJwt(storedJwt);
        setUser(userData);
      } else {
        // Si el token no es válido, limpiamos
        Cookies.remove("jwt_token");
        localStorage.removeItem("jwt");
      }
    } catch (error) {
      console.error("Error verificando sesión:", error);
    } finally {
      // ESTO ES CLAVE: Siempre quitamos el loading al final
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  async function login(token: string) {
    setLoading(true);
    Cookies.set("jwt_token", token, { expires: 7, path: "/" });
    localStorage.setItem("jwt", token);

    // Re-validamos para llenar el objeto 'user'
    await verifySession();
    window.location.href = "/dashboard";
  }

  function logout() {
    Cookies.remove("jwt_token");
    localStorage.removeItem("jwt");
    setJwt(null);
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, jwt, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
