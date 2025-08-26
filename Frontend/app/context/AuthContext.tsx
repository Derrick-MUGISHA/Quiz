"use client";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import type { AuthContextType, AuthProviderProps } from "@/types/auth";
import type { User } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
const [user, setUser] = useState<User | null>(() => {
  const storedUser = Cookies.get("user") || localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [loading, setLoading] = useState<boolean>(false);

const login = (userData: User, token: string) => {
  if (!userData || !token) return;

  // Store in cookies (existing)
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("user", JSON.stringify(userData), { expires: 7 });
  setUser(userData);

  // Also store in localStorage for API calls or refresh
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData)); // optional, useful for persistence

  console.log("Logged in user:", userData); // debug to check _id & role
};


  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
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
