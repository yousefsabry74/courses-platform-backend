# 📚 Courses Platform Backend

A RESTful API backend for an online courses platform built with Node.js, Express.js, MongoDB, and Google Gemini AI.

---

## 🛠️ Tech Stack

| Technology                    | Version | Purpose                       |
| ----------------------------- | ------- | ----------------------------- |
| Node.js + Express.js          | v5.x    | HTTP Server & Routing         |
| MongoDB + Mongoose            | v9.x    | Database & ODM                |
| JSON Web Token (JWT)          | v9.x    | Authentication                |
| bcrypt                        | v6.x    | Password Hashing              |
| Joi                           | v18.x   | Input Validation              |
| Google Generative AI (Gemini) | v0.24.x | AI Features                   |
| dotenv                        | v17.x   | Environment Variables         |
| CORS                          | v2.x    | Cross-Origin Resource Sharing |

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/courses-platform-backend.git
   cd courses-platform-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:

   ```env
   PORT=8000
   DBURL=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the server**
   ```bash
   node app.js
   ```

---

## 🌐 API Endpoints

### Courses — `/api/courses`

| Method | Endpoint             | Auth | Role  | Description                     |
| ------ | -------------------- | ---- | ----- | ------------------------------- |
| GET    | `/`                  | ❌   | Any   | Get all courses (Paginated)     |
| GET    | `/course`            | ❌   | Any   | Search & filter courses         |
| POST   | `/`                  | ✅   | Admin | Create a new course             |
| PATCH  | `/:id`               | ✅   | Admin | Update a course                 |
| DELETE | `/:id`               | ✅   | Admin | Delete a course                 |
| POST   | `/:id/generate-quiz` | ✅   | Admin | AI-generate a quiz for a course |

### Users — `/api/users`

| Method | Endpoint    | Auth | Role | Description               |
| ------ | ----------- | ---- | ---- | ------------------------- |
| POST   | `/register` | ❌   | Any  | Register a new user       |
| POST   | `/login`    | ❌   | Any  | Login and receive JWT     |
| GET    | `/`         | ✅   | Any  | Get all users (Paginated) |

> **Query Parameters for `GET /api/courses/course`:**
> `title`, `price`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** — Token issued on register/login, expires in **1 hour**
- **Role-Based Access Control (RBAC)** — Supports `user` and `admin` roles
- **Password hashing** with bcrypt (10 salt rounds)
- Password field is **never exposed** in API responses (`select: false`)

### 📚 Course Management

- Full **CRUD** operations on courses
- **Advanced filtering** by title (case-insensitive), exact price, or price range (minPrice/maxPrice)
- **Sorting** support (ascending/descending on any field)
- **Pagination** on all list endpoints

### 🤖 AI Integration — Google Gemini

- **Auto-generate course description** — If no description is provided when creating a course, Gemini AI automatically generates a professional Arabic description
- **AI Quiz Generation** — Generates 3 multiple-choice questions (MCQ) in Arabic based on the course description, saved directly to the course record

### 👥 User Management

- Register with username, email, password, age, and role
- Password excluded from all responses automatically

### 🔒 Security

- JWT verification middleware on all protected routes
- Role-based middleware guards admin-only operations
- `asyncHandler` wrapper for clean async error propagation
- Global error handler returning consistent JSON error responses
- CORS enabled for frontend integration
- All sensitive config stored in environment variables

---

## 🏗️ Data Models

### User

| Field     | Type   | Notes                                       |
| --------- | ------ | ------------------------------------------- |
| username  | String | Required, Unique, Trimmed                   |
| email     | String | Required, Unique, Lowercase                 |
| password  | String | Required, min 6 chars, Hidden from response |
| age       | Number | Optional, 10–100                            |
| role      | String | `user` or `admin`                           |
| createdAt | Date   | Auto-set, Immutable                         |
| updatedAt | Date   | Auto-updated                                |

### Course

| Field       | Type   | Notes                                                   |
| ----------- | ------ | ------------------------------------------------------- |
| title       | String | Required                                                |
| description | String | Required (AI-generated if not provided)                 |
| price       | Number | Required                                                |
| quizzes     | Array  | `question`, `options[]`, `correctAnswer` — AI-generated |
| reviews     | Array  | `userId` (ref User), `ratings` (1–5), `comment`         |

---

## 📁 Project Structure

```
courses-platform-backend/
├── app.js                  # Entry point
├── controller/
│   ├── coursecontroller.js # Course logic & AI integration
│   └── usercontroller.js   # Auth & user logic
├── middleware/
│   ├── asyncHandler.js     # Async error wrapper
│   ├── errorHandler.js     # Global error handler
│   └── verifytoken.js      # JWT & RBAC middleware
├── model/
│   ├── courseSchema.js     # Course Mongoose schema
│   └── userSchema.js       # User Mongoose schema
├── routes/
│   ├── routes.js           # Course routes
│   └── user.js             # User routes
└── validation/
    ├── course.validation.js # Joi validation for courses
    └── user.validation.js   # Joi validation for users
```
