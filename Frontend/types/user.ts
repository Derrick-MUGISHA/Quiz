
export type UserRole = "student" | "teacher";

export type User = {
 _id: string; 
  userId?: string; // from backend
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  totalQuestionsAnswered?: number;
  totalScore?: number;
  totalTimeTaken?: number;
};
