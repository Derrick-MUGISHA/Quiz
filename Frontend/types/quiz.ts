
export interface Question {
  _id: string;
  title: string;
  category: string;
  teacher: string;
  description: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  score: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shareLink: string;
  code?: string 
}

export interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}
