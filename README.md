# 📚 Quiz Builder Platform

A **full-stack quiz builder platform** that empowers teachers to create quizzes and students to take them in real-time. Built with modern web technologies, it focuses on usability, scalability, and performance.

* 🎨 **Frontend**: **Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Axios**
* ⚙️ **Backend**: **Node.js, Express, MongoDB (Mongoose)** with authentication, quiz management, and result tracking.

---

## 🚀 Features

### 🧑‍🏫 Teachers

* Create, publish, and manage quizzes.
* Add multiple-choice questions with hints, timers, and scoring.
* Track student performance with detailed results.

### 🎯 Students

* Take quizzes with real-time countdown timers.
* Modern and responsive UI for answering quizzes.
* View instant results and performance reports.

### 🔒 Security

* Authentication and authorization.
* Environment variables for sensitive data.
* Secure API endpoints.

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)

* [Next.js 15](https://nextjs.org/) – App Router for modern routing.
* [TypeScript](https://www.typescriptlang.org/) – Type safety.
* [TailwindCSS](https://tailwindcss.com/) – Utility-first styling.
* [shadcn/ui](https://ui.shadcn.com/) – UI components.
* [Axios](https://axios-http.com/) – API requests.

### Backend (`/Backend`)

* [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) – REST API.
* [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) – Database.
* [CORS](https://expressjs.com/en/resources/middleware/cors.html) – Cross-origin requests.
* JWT/cookie-based authentication.
* Quiz & user management endpoints.

---

## 📂 Project Structure (Updated Up to 26/9/25)

```
quiz-builder/
│
├── Backend/                  # Node.js + Express + MongoDB
│   ├── src/                  # Source code
│   │   ├── controllers/      # Quiz & Auth controllers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   ├── server.js             # Backend entry point
│   ├── seedTeacher.js        # Seed initial teacher data
│   ├── updateShareLinks.js   # Utility script
│   ├── package.json
│   ├── package-lock.json
│   ├── .env                  # Backend environment variables
│   ├── .env.example
│   ├── .dockerignore
│   └── docker-compose.yml    # Docker container setup
│
├── frontend/                 # Next.js 15 + TypeScript
│   ├── app/                  # Next.js App Router pages
│   ├── api/                  # Frontend API routes (optional)
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions
│   ├── types/                # TypeScript types
│   ├── public/               # Static assets
│   ├── middleware.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── .env.local            # Frontend environment variables
│
├── Dockerfile                # Dockerfile for backend
└── README.md                 # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/quiz-builder.git
cd quiz-builder
```

---

### 2️⃣ Backend Setup

> ⚠️ **Important:** The backend requires **Node.js (v18 or higher)** to run properly.  
> Make sure you have Node.js installed before starting the backend.  
> [Download Node.js](https://nodejs.org/)


```bash
cd Backend
npm install
```

Create a `.env` file in `/Backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Run backend locally:**

```bash
node server.js
```

**Or spin up the backend container using Docker:**

```bash
docker-compose up
```

This will start the backend with all necessary configurations automatically.

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend locally:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## 📡 API Endpoints (Backend)

### **Quizzes**

* `POST /api/quizzes` → Create a new quiz
* `GET /api/quizzes` → Get all quizzes
* `GET /api/quizzes/:id` → Get quiz by ID
* `POST /api/quizzes/:id/submit` → Submit answers and get results

### **Users**

* `POST /api/auth/register` → Register new teacher/student
* `POST /api/auth/login` → Login
* `GET /api/users/:id` → Get user profile

---

## 🤝 Contributing

We welcome contributions! Here’s how you can help:

1. **Fork the repository** to your GitHub account.
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/quiz-builder.git
   ```
3. **Create a feature branch** for your work:

   ```bash
   git checkout -b feature/my-feature
   ```
4. **Make changes** and commit:

   ```bash
   git commit -m "Add feature X"
   ```
5. **Push your branch** to GitHub:

   ```bash
   git push origin feature/my-feature
   ```
6. **Open a Pull Request** against the `main` branch of the original repository.
7. **Discuss and iterate** until the PR is approved and merged.

**Branching Guidelines:**

* `main` → Production-ready code
* `master` → Active development
* `feature/*` → New features
* `bugfix/*` → Bug fixes
* `hotfix/*` → Critical fixes
