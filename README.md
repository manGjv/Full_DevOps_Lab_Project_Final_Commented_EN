# Cybersecurity Learning Platform  
**ESILV – Year 4 Software Engineering Project**

This repository contains the source code for a **full-stack cybersecurity learning platform** developed as part of a **Year 4 Software Engineering course at ESILV**.

The project follows a **DevOps-oriented workflow**, simulating real industry practices:  
**planning (Jira) → development (Git/GitHub) → testing → code review → integration**.

---

## 🎯 Project Objectives

The objective of this project is to design and implement a **Cybersecurity Learning Platform** allowing users to:

- Access structured cybersecurity courses
- Learn progressively according to their level (Beginner, Intermediate, Expert)
- Follow clear and pedagogical explanations
- Complete quizzes to validate knowledge
- Track personal learning progress

From a software engineering perspective, the project focuses on:

- Clean and modular architecture
- Team collaboration and traceability
- Separation of frontend and backend concerns
- Code quality, testing, and maintainability

---

## 🧑‍🎓 Academic Context

- **School:** ESILV (École Supérieure d’Ingénieurs Léonard-de-Vinci)
- **Year:** 4
- **Course:** Software Engineering
- **Project type:** Group project
- **Team members:** Pierre-Antoine BAUDARD - Chinyere CUMMINGS - Anaïs DUMARQUEZ - Manon GEORGES
- **Language:** English
- **Approach:** Academic, structured, and easy to understand

---

## 🧩 Technologies Used

### Frontend
- React (Vite)
- React Router
- Context API
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB
- REST API

### DevOps & Collaboration
- Git & GitHub
- Jira (task planning and tracking)
- GitHub Actions (CI)
- ESLint
- Vitest & Supertest (testing)

---

## 🔀 Project Management & Git Workflow

### Jira Usage
All features and tasks were managed using **Jira**:

- Each task corresponds to a Jira ticket
- Jira tickets are linked to Git branches and Pull Requests
- This ensures traceability and clear task ownership

---

## 🌿 Git Branch Organization

Each student worked on **their own branch**, following a feature-based workflow.  
The `main` branch contains the stable and integrated version of the project.

### Existing Branches

- `main` – stable main branch
- `front` – frontend development branch
- `feature/DEV-9-auth-route` – authentication routes
- `feature/DEV-10-courses-route` – courses API routes
- `feature/DEV-11-quizz-route` – quiz API routes
- `feature/DEV-12-users-route` – users and profile routes

Each feature branch corresponds to a specific Jira ticket.

---

## 🧪 Testing & Code Quality

- **Backend testing**
  - Integration tests using Supertest
  - Unit tests for utility functions
- **Continuous Integration**
  - Tests run automatically via GitHub Actions
  - Code must pass tests before merging
- **Linting**
  - ESLint ensures consistent code style

This approach guarantees:
- Functional correctness
- Reduced regressions
- Maintainable and readable code

---

## ▶️ How to Run the Project (Development Mode)

### 1️⃣ Clone the repository
  bash
git clone <repository-url>
cd project-root

### 2️⃣ Run the Backend
cd backend
npm install
npm run dev

Backend runs on http://localhost:3000
MongoDB must be running (local or remote URI)

### 3️⃣ Run the Frontend
cd frontend
npm install
npm run dev


Frontend opens automatically on:
👉 http://localhost:5173

## 🔐 Authentication & Security

- Authentication implemented using JWT
- Protected routes enforced:
      Backend: authentication middleware
      Frontend: PrivateRoute component
-User data and learning progress are secured

## 📚 Platform Features
- User registration and login
- Course catalog with difficulty levels
- Course detail pages with lessons (text and video)
- Quiz system to test knowledge
- User profile with progress tracking
- Time spent tracking per user

## 📌 Project Scope & Limitations
- This is an academic project
- Not intended for production deployment
- Cloud deployment is out of scope
- Focus is on:
      Software architecture
      Collaboration
      DevOps practices
      Code quality


## ✅ Conclusion

This project demonstrates the application of software engineering and DevOps best practices in an academic environment, including:
    - Full-stack web development
    - Structured team collaboration
    - Use of professional tools (Jira, GitHub, CI)
    - Clean, testable, and maintainable code

The project reflects realistic industry workflows aligned with ESILV’s academic requirements.
