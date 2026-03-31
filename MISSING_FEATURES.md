# 🔴 الـ Backend - الحاجات الناقصة الواجب إضافتها

جدول بسيط للحاجات الناقصة فقط:

---

## 📊 Database Schemas الناقصة

### 1. Lesson Schema

```javascript
const lessonSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  title: { type: String, required: true }, /
  icon: { type: String, required: true }, 
  color: { type: String, required: true }, 
  sessions: { type: Number, required: true }, 
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### 2. Session Schema

```javascript
const sessionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  lessonId: { type: Number, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  available: { type: Boolean, default: true },
  objectives: [
    {
      icon: String,
      text: String,
    },
  ],
  activities: [
    {
      id: Number,
      type: String, // "content", "exercise", "video"
      title: String,
      content: String,
      chatbotContext: String,
    },
  ],
  quiz: {
    questions: [
      {
        id: Number,
        text: String,
        type: String, // "multiple", "true-false", "essay"
        options: [String],
        correctAnswer: String,
        points: Number,
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### 3. Progress Schema

```javascript
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Number, required: true },
  sessionId: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  tabsCompleted: [String], // ["objectives", "activities"]
  activitiesDone: [Number],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### 4. QuizResult Schema

```javascript
const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Number, required: true },
  sessionId: { type: Number, required: true },
  answers: mongoose.Schema.Types.Mixed, // { questionId: answer }
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});
```

---

## 🔌 API Endpoints الناقصة

### **LESSONS**

```
❌ GET /api/lessons
❌ GET /api/lessons/:lessonId
❌ POST /api/lessons (Teacher Only)
❌ PUT /api/lessons/:lessonId (Teacher Only)
❌ DELETE /api/lessons/:lessonId (Teacher Only)
```

### **SESSIONS**

```
❌ GET /api/lessons/:lessonId/sessions
❌ GET /api/lessons/:lessonId/sessions/:sessionId
❌ PUT /api/lessons/:lessonId/sessions/:sessionId (Teacher Only)
```

### **PROGRESS**

```
❌ GET /api/progress/:userId
❌ GET /api/progress/:userId/:lessonId/:sessionId
❌ POST /api/progress/save
```

### **QUIZ**

```
❌ GET /api/quiz/:lessonId/:sessionId
❌ POST /api/quiz/:lessonId/:sessionId/submit
❌ GET /api/quiz/:userId/results
❌ GET /api/quiz/:userId/:lessonId/:sessionId
```

### **TEACHER ANALYTICS**

```
❌ GET /api/teacher/analytics/students
❌ GET /api/teacher/analytics/students/:studentId
❌ GET /api/teacher/analytics/reports
```

### **CHATBOT** (اختياري)

```
❌ POST /api/chatbot/ask
```

---

**المجموع: 20 endpoint جديد + 4 schemas جديد**
