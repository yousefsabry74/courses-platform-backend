# 🤖 الـ Chatbot — الدليل الشامل

---

## 🎯 الـ Chatbot في الـ Frontend

### الوظائف الحالية:

1. **Context-based Knowledge Base** (موجود في الـ Frontend)
   - كل activity له `chatbotContext` كـ identifier
   - مثلاً: `"activity_1_work_concept"`
   - الـ Chatbot يرجع إجابات من knowledge base ثابتة

2. **Quiz Assistant** (موجود في الـ Frontend)
   - يعطي feedback عند كل إجابة
   - encouragement messages
   - emotional responses (😊, 😢, 🤩)

---

## 🔌 ما الذي يجب يكون في الـ Backend

### **Option 1: Simple Database Approach** (الأسهل والأسرع)

**الخطوات:**

1. **اعمل ChatbotKB Collection:**

```javascript
const chatbotKBSchema = new mongoose.Schema({
  context: { type: String, unique: true }, // "activity_1_work_concept"
  greeting: String,
  quickReplies: [String],
  responses: [
    {
      keywords: [String],
      answer: String,
    },
  ],
  fallback: String,
});
```

2. **الـ Endpoint:**

```javascript
POST /api/chatbot/ask

Request Body:
{
  "userId": "user_id_123",
  "lessonId": 1,
  "sessionId": 1,
  "chatbotContext": "activity_1_work_concept",
  "question": "ما معنى الشغل؟"
}

Logic في الـ Backend:
1️⃣ ابحث عن الـ context في DB
2️⃣ استخرج keywords من السؤال
3️⃣ match keywords مع responses
4️⃣ احفظ الـ conversation في Progress tracking
5️⃣ return answer
```

3. **Response:**

```javascript
{
  "status": "success",
  "data": {
    "answer": "⚡ الشغل في العلوم يتحقق عندما تؤثر قوة في جسم فينتقل في اتجاه القوة...",
    "context": "activity_1_work_concept",
    "keywords_matched": ["شغل", "معنى"]
  }
}
```

---

### **Option 2: AI-Powered Approach** (الأفضل - استخدام Gemini)

يستخدم Google Gemini API لإعطاء إجابات ذكية بدل الـ static responses.

**الخطوات:**

1. **المتطلبات:**

```bash
npm install @google/generative-ai dotenv
```

2. **في .env:**

```
GEMINI_API_KEY=your_api_key_here
```

3. **Controller:**

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chatbotAsk = async (req, res) => {
  const { question, lessonId, sessionId, context } = req.body;

  // System prompt للـ AI
  const systemPrompt = `
أنت معلم ذكي متخصص في تعليم طلاب الصف الخامس الابتدائي.
الدرس الحالي: الشغل والطاقة (درس رقم ${lessonId})
السياق: ${context}

قواعد الإجابة:
- استخدم لغة بسيطة وودية
- أضيف emojis مناسبة
- كن مشجعاً وإيجابياً
- اشرح بأمثلة حقيقية من حياتهم
- لا تزيد الإجابة عن 3 أسطر
- إذا السؤال خارج التخصص، قول براحة "هذا السؤال خارج درسنا"

`;

  try {
    const result = await model.generateContent(
      systemPrompt + "\nسؤال الطالب: " + question,
    );

    const answer = result.response.text();

    res.status(200).json({
      status: "success",
      data: {
        answer: answer,
        context: context,
        source: "gemini",
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ status: "error", message: "خطأ في الـ AI" });
  }
};

module.exports = { chatbotAsk };
```

---

## 🏗️ الهيكل الموصى به

```
task1/
├── controller/
│   ├── chatbotController.js ❌ جديد
│   └── ...
├── model/
│   ├── chatbotKBSchema.js ❌ جديد (اختياري)
│   └── ...
├── routes/
│   ├── chatbot.js ❌ جديد
│   └── ...
└── app.js (أضيف router للـ chatbot)
```

---

## 📋 Implementation Steps

### Step 1: اعمل الـ Controller

```javascript
// controller/chatbotController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askChatbot = async (req, res) => {
  const { question, lessonId, sessionId, context, userId } = req.body;

  if (!question || !context) {
    return res.status(400).json({
      status: "error",
      message: "السؤال والـ context مطلوب",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `
أنت معلم ذكي متخصص في تعليم طلاب الصف الخامس الابتدائي الفيزياء.
السياق: ${context}
${lessonId ? `الدرس رقم: ${lessonId}` : ""}

قواعد الإجابة:
- استخدم لغة عربية بسيطة وودية 
- أضيف emojis مناسبة
- كن مشجعاً جداً
- اشرح بأمثلة واقعية
- لا تطول الإجابة أكتر من 150 كلمة
- الرد بالعربية فقط
    `;

    const result = await model.generateContent(
      systemPrompt + "\n\nسؤال الطالب: " + question,
    );

    const answer = result.response.text();

    res.status(200).json({
      status: "success",
      data: {
        answer: answer,
        context: context,
        source: "gemini",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({
      status: "error",
      message: "حدث خطأ في الـ AI",
    });
  }
};

module.exports = { askChatbot };
```

### Step 2: اعمل الـ Route

```javascript
// routes/chatbot.js

const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken } = require("../middleware/verifytoken");
const { askChatbot } = require("../controller/chatbotController");

const router = express.Router();

router.post("/ask", verifyToken, asyncHandler(askChatbot));

module.exports = router;
```

### Step 3: ربط الـ Router في app.js

```javascript
const chatbotRouter = require("./routes/chatbot");

app.use("/api/chatbot", chatbotRouter);
```

### Step 4: أضيف GEMINI_API_KEY في .env

```
GEMINI_API_KEY=aiz...your_key_here
```

---

## 🔑 الحصول على Google Gemini API Key

1. اذهب إلى https://aistudio.google.com
2. اضغط "Get API key"
3. اختر "Create API key in new Google Cloud project"
4. انسخ الـ key
5. احطه في .env

---

## 🧪 Test في Postman

```javascript
POST /api/chatbot/ask
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Body: {
  "userId": "user_id_123",
  "lessonId": 1,
  "sessionId": 1,
  "context": "activity_1_work_concept",
  "question": "ما معنى الشغل في الفيزياء؟"
}

Response:
{
  "status": "success",
  "data": {
    "answer": "⚡ الشغل في الفيزياء يحدث عندما تؤثر قوة على جسم فيتحرك في اتجاه هذه القوة. مثلاً، إذا رفعت درس كتاب من الطاولة، أنت تعمل شغل! 📚💪 لكن إذا حملت الكتاب وقفت ساكناً، لا يوجد شغل لأنه لا توجد حركة. 😊",
    "context": "activity_1_work_concept",
    "source": "gemini",
    "timestamp": "2026-03-30T10:00:00.000Z"
  }
}
```

---

## ⚙️ متغيرات البيئة المطلوبة

```bash
# للـ Gemini API (اختياري):
GEMINI_API_KEY=your_api_key_here

# أو للـ ChatGPT (اختياري):
OPENAI_API_KEY=your_api_key_here
```

---

## 🎓 كيفية الـ Frontend يستخدمه

```javascript
// في js/pages/session.js

async function openChatbotFor(context) {
  const user = AUTH.getUser();
  const token = sessionStorage.getItem("token");

  try {
    // أول: احصل على الـ greeting من الـ backend
    const response = await fetch("/api/chatbot/greeting", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context }),
    });

    const data = await response.json();
    showChatbotPanel(data.data.greeting);

    // ثاني: عند السؤال عن شيء
    document
      .getElementById("chatbot-input")
      .addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
          const question = e.target.value.trim();

          const ansResponse = await fetch("/api/chatbot/ask", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              lessonId: currentLessonId,
              sessionId: currentSessionId,
              context: context,
              question: question,
            }),
          });

          const ansData = await ansResponse.json();
          addChatbotMessage(ansData.data.answer);
        }
      });
  } catch (error) {
    console.error("Chatbot Error:", error);
    showToast("❌ خطأ في الـ Chatbot", "error");
  }
}
```

---

## 📊 أنواع الـ Chatbot Contexts

```javascript
// في الـ lessons data:

activities: [
  {
    id: 1,
    chatbotContext: "activity_1_work_concept", // تعريف الشغل
    title: "متى يحدث الشغل؟",
  },
  {
    id: 2,
    chatbotContext: "activity_1_work_formula", // قانون الشغل
    title: "قانون الشغل والحسابات",
  },
  {
    id: 3,
    chatbotContext: "activity_1_friction", // الاحتكاك
    title: "الاحتكاك وتأثيره",
  },
];
```

---

## 🎯 الخلاصة

**الحد الأدنى المطلوب للـ Chatbot:**

```
✅ POST /api/chatbot/ask — endpoint واحد بس!
   - استقبل السؤال والـ context من الـ Frontend
   - استخدم Gemini API للإجابة (أو static KB)
   - return الإجابة

ذلك كافي لتشتغل الكل!
```

**الأولويات:**

1. 🔴 Implement POST /api/chatbot/ask مع Gemini
2. 🟠 Test مع الـ Frontend
3. 🟡 تحسينات إضافية

---

**ملاحظة:** إذا ما عندك Gemini API key، ممكن تستخدم static knowledge base في الـ Database بدل الـ AI.
