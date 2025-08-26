
import { ReactNode } from "react";
import { User } from "./user";

export type AuthContextType = {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean; 
  setLoading: (loading: boolean) => void; 
};

export type AuthProviderProps = {
  children: ReactNode;
};
