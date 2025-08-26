"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import type { AuthContextType, AuthProviderProps } from "@/types/auth";
import type { User } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (typeof window !== "undefined") {
      const localUser = localStorage.getItem("user");
      if (localUser) setUser(JSON.parse(localUser));
    }
  }, []);

  const login = (userData: User, token: string) => {
    if (!userData || !token) return;

    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });


    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    setUser(userData);
    console.log("Logged in user:", userData);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
