export interface Question {
    title: string;
    text: string;
    category: string;
    options: string[];
    correctAnswer: string;
}

export interface Quiz {
    _id: string;
    title: string;
    questions: Question[];
    createdBy?: string;
}

export interface Result {
    score: number;
    total: number;
}