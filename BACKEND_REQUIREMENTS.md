# 📋 توثيق متطلبات الـ Backend

## منصة التعلم الذكية - Backend Documentation

---

## 🎯 نظرة عامة

هذا المستند يشرح جميع الـ Endpoints والـ Database schemas المطلوبة للتكامل بين الـ Frontend والـ Backend.

---

## 📁 Database Schemas المطلوبة

### 1. Schema: Lesson (الدروس)

```javascript
{
  _id: ObjectId,
  id: Number,              // معرّف فريد مثل 1, 2, 3
  title: String,           // عنوان الدرس
  icon: String,            // emoji أو HTML icon
  color: String,           // hex color مثل "#FF5733"
  sessions: Number,        // عدد الحصص
  available: Boolean,      // هل الدرس متاح
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Schema: Session (الحصص التعليمية)

```javascript
{
  _id: ObjectId,
  id: Number,              // معرّف فريد (1, 2, 3...)
  lessonId: Number,        // ID الدرس التابعة له
  title: String,           // عنوان الحصة
  icon: String,            // emoji
  available: Boolean,      // هل الحصة متاحة
  objectives: [
    {
      icon: String,        // emoji للهدف
      text: String         // نص الهدف
    }
  ],
  activities: [            // الأنشطة داخل الحصة
    {
      id: Number,
      type: String,        // "content", "exercise", "video"
      title: String,
      content: String,     // HTML أو نص
      chatbotContext: String
    }
  ],
  quiz: {
    questions: [
      {
        id: Number,
        text: String,      // نص السؤال
        type: String,      // "multiple", "true-false", "essay"
        options: [String], // الخيارات (للأسئلة المتعددة)
        correctAnswer: String,
        points: Number
      }
    ]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Schema: User (المستخدمون)

**موجود - تحديثات إضافية:**

```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  email: String,
  password: String (hashed),
  role: String,           // "student" أو "teacher"
  avatar: String,         // avatar URL
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Schema: Progress (تقدم الطالب)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // reference to User
  lessonId: Number,
  sessionId: Number,
  completed: Boolean,
  tabsCompleted: [String], // ["objectives", "activities"]
  activitiesDone: [Number],
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Schema: QuizResult (نتائج الـ Quiz)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // reference to User
  lessonId: Number,
  sessionId: Number,
  answers: {
    questionId: String     // الإجابة على كل سؤال
  },
  score: Number,           // النتيجة النهائية (0-100)
  totalQuestions: Number,
  correctAnswers: Number,
  submittedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints المطلوبة

### **LESSONS ENDPOINTS** (الدروس)

#### 1️⃣ GET /api/lessons

احصل على جميع الدروس

```
GET /api/lessons

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "وحدة القوى والطاقة",
      "icon": "⚡",
      "color": "#FF5733",
      "sessions": 5,
      "available": true,
      "sessions_data": []
    }
  ]
}
```

#### 2️⃣ GET /api/lessons/:lessonId

احصل على دروس محددة مع الحصص

```
GET /api/lessons/1

Response (200):
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "وحدة القوى والطاقة",
    "icon": "⚡",
    "sessions_data": [
      {
        "id": 1,
        "title": "مقدمة القوى",
        "icon": "📚",
        "available": true,
        "objectives": [
          {
            "icon": "🎯",
            "text": "فهم مفهوم القوة"
          }
        ],
        "activities": [],
        "quiz": { "questions": [] }
      }
    ]
  }
}
```

#### 3️⃣ POST /api/lessons (Teacher Only)

إنشاء درس جديد

```
POST /api/lessons
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "title": "درس جديد",
  "icon": "📖",
  "color": "#FF5733",
  "sessions": 3,
  "available": true
}

Response (201):
{
  "status": "success",
  "message": "تم إنشاء الدرس بنجاح",
  "data": { lesson object }
}
```

#### 4️⃣ PUT /api/lessons/:lessonId (Teacher Only)

تعديل درس

```
PUT /api/lessons/1
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "title": "عنوان جديد",
  "available": false
}

Response (200):
{
  "status": "success",
  "message": "تم تحديث الدرس",
  "data": { lesson object }
}
```

#### 5️⃣ DELETE /api/lessons/:lessonId (Teacher Only)

حذف درس

```
DELETE /api/lessons/1
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "message": "تم حذف الدرس"
}
```

---

### **SESSIONS ENDPOINTS** (الحصص التعليمية)

#### 1️⃣ GET /api/lessons/:lessonId/sessions

احصل على جميع حصص الدرس

```
GET /api/lessons/1/sessions

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "lessonId": 1,
      "title": "مقدمة القوى",
      "icon": "📚",
      "available": true
    }
  ]
}
```

#### 2️⃣ GET /api/lessons/:lessonId/sessions/:sessionId

احصل على حصة محددة مع التفاصيل الكاملة

```
GET /api/lessons/1/sessions/1

Response (200):
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "مقدمة القوى",
    "icon": "📚",
    "available": true,
    "objectives": [ ... ],
    "activities": [ ... ],
    "quiz": { "questions": [ ... ] }
  }
}
```

#### 3️⃣ PUT /api/lessons/:lessonId/sessions/:sessionId (Teacher Only)

تعديل حصة - تفعيل/تعطيل

```
PUT /api/lessons/1/sessions/1
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "available": false,
  "title": "عنوان جديد"
}

Response (200):
{
  "status": "success",
  "message": "تم تحديث الحصة",
  "data": { session object }
}
```

---

### **PROGRESS ENDPOINTS** (تتبع التقدم)

#### 1️⃣ GET /api/progress/:userId

احصل على تقدم الطالب الكلي

```
GET /api/progress/user123
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": {
    "userId": "user123",
    "totalScore": 450,
    "completedSessions": 9,
    "completedLessons": 2,
    "progress": [
      {
        "lessonId": 1,
        "completed": true,
        "score": 350,
        "sessionsCompleted": 5
      }
    ]
  }
}
```

#### 2️⃣ GET /api/progress/:userId/:lessonId/:sessionId

احصل على تقدم معين

```
GET /api/progress/user123/1/1
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": {
    "userId": "user123",
    "lessonId": 1,
    "sessionId": 1,
    "completed": true,
    "tabsCompleted": ["objectives", "activities"]
  }
}
```

#### 3️⃣ POST /api/progress/save

حفظ تقدم الطالب

```
POST /api/progress/save
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Body: {
  "userId": "user123",
  "lessonId": 1,
  "sessionId": 1,
  "completed": true,
  "tabsCompleted": ["objectives", "activities"],
  "activitiesDone": [1, 2]
}

Response (200):
{
  "status": "success",
  "message": "تم حفظ التقدم",
  "data": { progress object }
}
```

---

### **QUIZ ENDPOINTS** (الـ Quiz والاختبارات)

#### 1️⃣ GET /api/quiz/:lessonId/:sessionId

احصل على أسئلة الـ Quiz

```
GET /api/quiz/1/1

Response (200):
{
  "status": "success",
  "data": {
    "questions": [
      {
        "id": 1,
        "text": "ما هي القوة؟",
        "type": "multiple",
        "options": ["تعريف 1", "تعريف 2", "تعريف 3"],
        "points": 5
      }
    ]
  }
}
```

#### 2️⃣ POST /api/quiz/:lessonId/:sessionId/submit

إرسال إجابات الـ Quiz

```
POST /api/quiz/1/1/submit
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Body: {
  "userId": "user123",
  "answers": {
    "1": "option1",
    "2": "true",
    "3": "إجابة في نص"
  }
}

Response (200):
{
  "status": "success",
  "message": "تم حفظ الإجابات",
  "data": {
    "score": 85,
    "totalQuestions": 10,
    "correctAnswers": 8,
    "result": {
      "1": { "correct": true, "yourAnswer": "option1" },
      "2": { "correct": false, "yourAnswer": "false", "correct": "true" }
    }
  }
}
```

#### 3️⃣ GET /api/quiz/:userId/results

احصل على نتائج الـ Quiz السابقة

```
GET /api/quiz/user123/results
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": [
    {
      "lessonId": 1,
      "sessionId": 1,
      "score": 85,
      "submittedAt": "2026-03-30T10:00:00Z"
    }
  ]
}
```

#### 4️⃣ GET /api/quiz/:userId/:lessonId/:sessionId

احصل على نتيجة محددة

```
GET /api/quiz/user123/1/1
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": {
    "lessonId": 1,
    "sessionId": 1,
    "score": 85,
    "answers": { ... },
    "submittedAt": "2026-03-30T10:00:00Z"
  }
}
```

---

### **TEACHER ANALYTICS ENDPOINTS** (تحليلات المعلم)

#### 1️⃣ GET /api/teacher/analytics/students

احصل على قائمة الطلاب وإحصائياتهم

```
GET /api/teacher/analytics/students
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": [
    {
      "studentId": "student1",
      "name": "أحمد محمد",
      "totalScore": 350,
      "completedSessions": 5,
      "averageScore": 87.5,
      "progress": 45
    }
  ]
}
```

#### 2️⃣ GET /api/teacher/analytics/students/:studentId

احصل على تقرير طالب محدد

```
GET /api/teacher/analytics/students/student1
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": {
    "studentId": "student1",
    "name": "أحمد محمد",
    "email": "ahmad@example.com",
    "joinedAt": "2026-01-15T00:00:00Z",
    "stats": {
      "totalScore": 350,
      "completedSessions": 5,
      "completedLessons": 2,
      "averageScore": 87.5,
      "highestScore": 95,
      "lowestScore": 72
    },
    "byLesson": [
      {
        "lessonId": 1,
        "title": "وحدة القوى",
        "score": 180,
        "sessions": 3,
        "completedSessions": 3
      }
    ]
  }
}
```

#### 3️⃣ GET /api/teacher/analytics/reports

احصل على تقرير شامل للفصل

```
GET /api/teacher/analytics/reports
Headers: {
  "Authorization": "Bearer {token}"
}

Response (200):
{
  "status": "success",
  "data": {
    "totalStudents": 25,
    "activeStudents": 20,
    "classAverageScore": 82.5,
    "topPerformers": [ ... ],
    "needsAttention": [ ... ],
    "lessonsCompleted": 3,
    "lessonsInProgress": 2
  }
}
```

---

### **CHATBOT ENDPOINTS** (المساعد الذكي - اختياري)

#### 1️⃣ POST /api/chatbot/ask

اسأل المساعد الذكي

```
POST /api/chatbot/ask
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Body: {
  "userId": "user123",
  "lessonId": 1,
  "sessionId": 1,
  "question": "ما معنى القوة الكهربائية؟",
  "context": "quiz"  // أو "activity"
}

Response (200):
{
  "status": "success",
  "data": {
    "answer": "القوة الكهربائية هي...",
    "hint": "تلميح إضافي",
    "references": ["مبدأ كولوم", "الشحنات"]
  }
}
```

---

## 🔐 Authentication Headers

جميع الـ Endpoints المحمية تحتاج:

```
Authorization: Bearer {token}
```

الـ Token يتم الحصول عليه من:

```
POST /api/users/login
Body: {
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { user object }
}
```

---

## ✅ Error Response Format

```javascript
{
  "status": "error",
  "message": "رسالة الخطأ",
  "errors": [
    {
      "field": "email",
      "message": "البريد غير صيغة صحيحة"
    }
  ]
}
```

---

## 📊 Status Codes

| Code | المعنى                          |
| ---- | ------------------------------- |
| 200  | نجح                             |
| 201  | تم الإنشاء بنجاح                |
| 400  | طلب غير صحيح                    |
| 401  | غير مصرح (قم بتسجيل الدخول)     |
| 403  | لا توجد صلاحية (لا يمكن الوصول) |
| 404  | غير موجود                       |
| 500  | خطأ في الخادم                   |

---

## 🔄 Integration Checklist

- [ ] إنشاء Database Schemas
- [ ] بناء جميع Lesson Endpoints
- [ ] بناء جميع Session Endpoints
- [ ] بناء Progress Endpoints
- [ ] بناء Quiz Endpoints
- [ ] بناء Teacher Analytics Endpoints
- [ ] إضافة Validation للـ Input
- [ ] إضافة Error Handling
- [ ] اختبار جميع الـ Endpoints
- [ ] تحديث Frontend للتواصل مع الـ Backend بدل localStorage

---

## 📝 ملاحظات مهمة

1. **Authentication**: جميع الـ Endpoints ما عدا `GET /api/lessons` يحتاج Token
2. **Database Relationships**: User > Progress, QuizResult
3. **Caching**: يمكن استخدام Redis لـ cache الدروس والحصص
4. **Pagination**: يمكن إضافة pagination للـ analytics بعد
5. **Validation**: استخدم Joi مثل الموجود في الـ project

---

**آخر تحديث**: 2026-03-30
