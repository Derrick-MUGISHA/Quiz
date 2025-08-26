// types/api.ts
import { User } from "./user";

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
