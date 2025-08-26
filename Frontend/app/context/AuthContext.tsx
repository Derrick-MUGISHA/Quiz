"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import type { AuthContextType, AuthProviderProps } from "@/types/auth";
import type { User } from "@/types/user";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 


  const fetchUserFromToken = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_Auth}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user from token:", err);
      setUser(null);
      Cookies.remove("token");
      Cookies.remove("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    fetchUserFromToken().finally(() => setLoading(false));
  }, []);

  const login = (userData: User, token: string) => {
    if (!userData || !token) return;

    // Store cookies
    Cookies.set("token", token, { expires: 7, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });

    // Store localStorage
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
    toast("Logged out successfully");
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
