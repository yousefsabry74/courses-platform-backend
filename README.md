# 📚 School Platform Backend

A RESTful API backend for an interactive educational school platform built with Node.js, Express.js, MongoDB, and Google Gemini AI. The platform supports lessons, sessions, student progress tracking, AI-powered chatbot assistance, and quiz review.

---

## 🛠️ Tech Stack

| Technology                    | Version  | Purpose                        |
| ----------------------------- | -------- | ------------------------------ |
| Node.js + Express.js          | v5.x     | HTTP Server & Routing          |
| MongoDB + Mongoose            | v8.x     | Database & ODM                 |
| JSON Web Token (JWT)          | v9.x     | Authentication                 |
| bcrypt                        | v6.x     | Password Hashing               |
| Joi                           | v18.x    | Input Validation               |
| Google Generative AI (Gemini) | v0.24.x  | AI Chatbot & Quiz Review       |
| Multer                        | v2.x     | File Uploads                   |
| Helmet                        | v8.x     | HTTP Security Headers          |
| express-rate-limit            | v8.x     | Rate Limiting                  |
| express-mongo-sanitize        | v2.x     | NoSQL Injection Prevention     |
| express-xss-sanitizer         | v2.x     | XSS Attack Prevention          |
| hpp                           | v0.2.x   | HTTP Parameter Pollution Guard |
| dotenv                        | v17.x    | Environment Variables          |
| CORS                          | v2.x     | Cross-Origin Resource Sharing  |
| nodemon                       | v3.x     | Dev Auto-Restart               |

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yousefsabry74/school-backend.git
   cd school-backend
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
   # Development (with auto-restart)
   npm run dev

   # Production
   npm start
   ```

---

## 🌐 API Endpoints

### Courses — `/api/courses`

| Method | Endpoint             | Auth | Role    | Description                              |
| ------ | -------------------- | ---- | ------- | ---------------------------------------- |
| GET    | `/`                  | ❌   | Any     | Get all courses (Paginated)              |
| GET    | `/course`            | ❌   | Any     | Search & filter courses                  |
| POST   | `/`                  | ✅   | Teacher | Create a new course                      |
| POST   | `/course/cover`      | ✅   | Teacher | Upload a cover image for a course        |
| PATCH  | `/:id`               | ✅   | Teacher | Update a course                          |
| DELETE | `/:id`               | ✅   | Teacher | Delete a course                          |
| POST   | `/:id/generate-quiz` | ✅   | Teacher | AI-generate a quiz for a course          |

> **Query Parameters for `GET /api/courses/course`:**
> `title`, `price`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`

---

### Users — `/api/users`

| Method | Endpoint    | Auth | Role    | Description                    |
| ------ | ----------- | ---- | ------- | ------------------------------ |
| POST   | `/register` | ❌   | Any     | Register a new user            |
| POST   | `/login`    | ❌   | Any     | Login and receive JWT          |
| GET    | `/`         | ✅   | Teacher | Get all users (Paginated)      |
| POST   | `/avatar`   | ✅   | Any     | Upload a profile avatar image  |

---

### Lessons — `/api/lessons`

| Method | Endpoint | Auth | Role    | Description            |
| ------ | -------- | ---- | ------- | ---------------------- |
| GET    | `/`      | ❌   | Any     | Get all lessons        |
| GET    | `/:id`   | ❌   | Any     | Get a single lesson    |
| POST   | `/`      | ✅   | Teacher | Create a new lesson    |
| PATCH  | `/:id`   | ✅   | Teacher | Update a lesson        |
| DELETE | `/:id`   | ✅   | Teacher | Delete a lesson        |

---

### Sessions — `/api/lessons/:lessonId/sessions`

Sessions are **nested under lessons** and accessed via the lesson route.

| Method | Endpoint        | Auth | Role    | Description             |
| ------ | --------------- | ---- | ------- | ----------------------- |
| GET    | `/`             | ❌   | Any     | Get all sessions for a lesson   |
| GET    | `/:sessionId`   | ❌   | Any     | Get a single session    |
| PATCH  | `/:sessionId`   | ✅   | Teacher | Update a session        |

---

### Chatbot — `/api/chatbot`

| Method | Endpoint          | Auth | Role | Description                             |
| ------ | ----------------- | ---- | ---- | --------------------------------------- |
| POST   | `/ask`            | ✅   | Any  | Ask the AI chatbot a question           |
| POST   | `/review-answers` | ✅   | Any  | Submit quiz answers for AI review       |

---

### Progress — `/api/progress`

| Method | Endpoint                              | Auth | Role    | Description                          |
| ------ | ------------------------------------- | ---- | ------- | ------------------------------------ |
| POST   | `/save`                               | ✅   | Any     | Save student progress in a session   |
| POST   | `/quiz`                               | ✅   | Any     | Submit and save a quiz result        |
| GET    | `/quiz-results/me`                    | ✅   | Any     | Get all my quiz results              |
| GET    | `/quiz-results/teacher-overview`      | ✅   | Teacher | Get all students' quiz results       |
| GET    | `/quiz/:lessonId/:sessionId`          | ✅   | Any     | Get my quiz result for a session     |
| GET    | `/:userId/:lessonId/:sessionId`       | ✅   | Any     | Get progress for a specific session  |

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** — Token issued on register/login, expires in **1 hour**
- **Role-Based Access Control (RBAC)** — Supports `student` and `teacher` roles
- **Password hashing** with bcrypt (10 salt rounds)
- Password field is **never exposed** in API responses (`select: false`)
- **Login rate limiting** — Max 5 attempts per 15 minutes per IP

### 📚 Course & Lesson Management

- Full **CRUD** operations on courses and lessons
- **Sessions nested inside lessons** — each lesson contains multiple sessions
- **Course cover image upload** via Multer (`/api/courses/course/cover`)
- **Advanced filtering** by title (case-insensitive), price, or price range
- **Sorting** and **Pagination** on all list endpoints

### 🤖 AI Integration — Google Gemini

- **Auto-generate course description** — If no description is provided, Gemini AI generates a professional Arabic description automatically
- **AI Quiz Generation** — Generates 3 MCQ questions in Arabic based on the course description
- **AI Chatbot** — Context-aware chatbot that assists students with lesson-specific questions
- **AI Quiz Review** — Students submit quiz answers and receive instant AI feedback on their performance

### 📊 Student Progress Tracking

- Track which **tabs** (objectives, activities) a student has completed in a session
- Track which **activities** within a session are done
- **Session completion** status per student
- **Quiz results** stored per student per session
- **Teacher dashboard overview** — teachers can view all students' quiz scores across sessions

### 👥 User Management

- Register with username, email, password, age, role, class, grade, and display name
- Password excluded from all responses automatically
- **Avatar image upload** via Multer (`/api/users/avatar`)
- Users can be enrolled in multiple courses

### 🔒 Security

- **Helmet** — Sets secure HTTP response headers
- **Rate Limiting** — Global: 100 req/15min; Login endpoint: 5 req/15min
- **NoSQL Injection Prevention** via `express-mongo-sanitize`
- **XSS Prevention** via `express-xss-sanitizer`
- **HTTP Parameter Pollution Guard** via `hpp`
- **JWT verification** middleware on all protected routes
- **Role-based middleware** guards teacher-only operations
- `asyncHandler` wrapper for clean async error propagation
- Global error handler returning consistent JSON error responses
- CORS enabled for frontend integration
- All sensitive config stored in environment variables

---

## 🏗️ Data Models

### User

| Field       | Type     | Notes                                         |
| ----------- | -------- | --------------------------------------------- |
| username    | String   | Required, Unique, Trimmed                     |
| email       | String   | Required, Unique, Lowercase                   |
| password    | String   | Required, min 6 chars, Hidden from response   |
| age         | Number   | Optional, 10–100                              |
| role        | String   | `student` or `teacher`                        |
| class       | String   | Required                                      |
| grade       | Number   | Optional                                      |
| displayName | String   | Optional                                      |
| avatar      | String   | Default avatar path                           |
| courses     | ObjectId[] | References to enrolled Courses              |
| createdAt   | Date     | Auto-set, Immutable                           |
| updatedAt   | Date     | Auto-updated                                  |

### Course

| Field       | Type   | Notes                                                   |
| ----------- | ------ | ------------------------------------------------------- |
| title       | String | Required                                                |
| description | String | Required (AI-generated if not provided)                 |
| price       | Number | Required                                                |
| quizzes     | Array  | `question`, `options[]`, `correctAnswer` — AI-generated |
| reviews     | Array  | `userId` (ref User), `ratings` (1–5), `comment`         |

### Lesson

| Field     | Type    | Notes                           |
| --------- | ------- | ------------------------------- |
| id        | Number  | Required, Unique                |
| title     | String  | Required                        |
| icon      | String  | Required                        |
| color     | String  | Required                        |
| sessions  | Number  | Number of sessions in lesson    |
| available | Boolean | Default: true                   |
| createdAt | Date    | Auto-set                        |
| updatedAt | Date    | Auto-updated                    |

### Session

| Field      | Type    | Notes                                                    |
| ---------- | ------- | -------------------------------------------------------- |
| id         | Number  | Required                                                 |
| lessonId   | ObjectId | Ref to Lesson                                           |
| title      | String  | Required                                                 |
| icon       | String  | Required                                                 |
| available  | Boolean | Default: true                                            |
| objectives | Array   | `{ icon, text }`                                         |
| activities | Array   | `{ id, type, title, content, chatbotContext }` — type: `content`, `exercise`, `video` |
| quiz       | Object  | `{ questions: [{ id, text, type, options, correctAnswer, points }] }` — type: `multiple`, `true-false`, `essay` |
| createdAt  | Date    | Auto-set                                                 |
| updatedAt  | Date    | Auto-updated                                             |

### Progress

| Field           | Type     | Notes                                       |
| --------------- | -------- | ------------------------------------------- |
| userId          | ObjectId | Ref to User                                 |
| lessonId        | Number   | Lesson ID                                   |
| sessionId       | Number   | Session ID                                  |
| completed       | Boolean  | Whether session is fully completed          |
| tabsCompleted   | String[] | e.g. `["objectives", "activities"]`         |
| activitiesDone  | Number[] | Array of completed activity IDs             |
| createdAt       | Date     | Auto-set                                    |
| updatedAt       | Date     | Auto-updated                                |

### QuizResult

| Field     | Type     | Notes                              |
| --------- | -------- | ---------------------------------- |
| userId    | ObjectId | Ref to User                        |
| lessonId  | ObjectId | Ref to Lesson                      |
| sessionId | ObjectId | Ref to Session                     |
| answers   | Array    | Student's submitted answers        |
| score     | Number   | Total score                        |
| feedback  | String   | AI-generated feedback              |
| createdAt | Date     | Auto-set                           |

---

## 📁 Project Structure

```
school-backend/
├── app.js                          # Entry point & middleware setup
├── controller/
│   ├── coursecontroller.js         # Course logic & AI integration
│   ├── usercontroller.js           # Auth & user logic
│   ├── covercontroller.js          # Course cover upload (Multer)
│   ├── avatarcontroller.js         # User avatar upload (Multer)
│   ├── lessoncontroller.js         # Lesson CRUD logic
│   ├── sessioncontroller.js        # Session read & update logic
│   ├── chatbotController.js        # AI chatbot & quiz review
│   └── progressController.js      # Student progress & quiz results
├── middleware/
│   ├── asyncHandler.js             # Async error wrapper
│   ├── errorHandler.js             # Global error handler
│   └── verifytoken.js             # JWT & RBAC middleware
├── model/
│   ├── courseSchema.js             # Course Mongoose schema
│   ├── userSchema.js               # User Mongoose schema
│   ├── lessonSchema.js             # Lesson Mongoose schema
│   ├── sessionSchema.js            # Session Mongoose schema
│   ├── progressSchema.js           # Progress Mongoose schema
│   ├── quizResultSchema.js         # Quiz Result Mongoose schema
│   └── chatbotKBSchema.js          # Chatbot Knowledge Base schema
├── routes/
│   ├── routes.js                   # Course routes
│   ├── user.js                     # User routes
│   ├── lessons.js                  # Lesson routes (+ nested sessions)
│   ├── sessions.js                 # Session routes
│   ├── chatbot.js                  # Chatbot routes
│   └── progress.js                 # Progress & quiz result routes
└── validation/
    ├── course.validation.js        # Joi validation for courses
    └── user.validation.js          # Joi validation for users
```
