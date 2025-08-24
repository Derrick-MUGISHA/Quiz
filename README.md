# 📚 Quiz Builder Platform

A **full-stack quiz builder platform** that allows teachers to create quizzes and students to take them in real-time. The project is split into two parts:

* 🎨 **Frontend**: Built with **Next.js 15, TypeScript, TailwindCSS, shadcn/ui**, and **Axios**.
* ⚙️ **Backend**: Built with **Node.js, Express, MongoDB (Mongoose)**, with authentication(cookies), quiz management, and result tracking.

---

## 🚀 Features

### Teachers

* Create, Publish, and Review.
* Add multiple-choice questions with hints and time limits.
* Track student performance.

### 🎯 Students

* Take quizzes in real-time with countdown timers.
* Select answers using modern UI (radio buttons, checkers).
* View results instantly after submission.

### 🔒 Security

* Authentication & Authorization(cooke management).
* Environment variables for sensitive data.

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)

* [Next.js 15](https://nextjs.org/) – App Router
* [TypeScript](https://www.typescriptlang.org/)
* [TailwindCSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/) – modern UI components
* [Axios](https://axios-http.com/) – API communication

### Backend (`/backend`)

* [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
* [CORS](https://expressjs.com/en/resources/middleware/cors.html)
* REST API with authentication and quiz management

---

## 📂 Project Structure

```
quiz-builder/
│── backend/                # Backend (Node.js + Express + MongoDB)
│   ├── controllers/        # Quiz & Auth controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── server.js           # App entry point
│   ├── package.json
│   └── .env                # Backend environment variables
│
│── frontend/               # Frontend (Next.js 15 + TS)
│   ├── app/                # Next.js App Router pages
│   ├── components/         # UI components
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   ├── package.json
│   └── .env                # Frontend environment variables
│
└── README.md               # Combined documentation
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/quiz-builder.git
cd quiz-builder
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```bash
cd backend/src
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
pnpm install
```

Create a `.env` file in `/frontend` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## 📡 API Endpoints (Backend)

### **Quizzes**

* `POST /api/quizzes` → Create quiz
* `GET /api/quizzes` → Get all quizzes
* `GET /api/quizzes/:id` → Get quiz by ID
* `POST /api/quizzes/:id/submit` → Submit answers and get results

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request
