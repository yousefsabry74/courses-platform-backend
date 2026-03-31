# 🆕 المميزات الجديدة

## 1️⃣ Backend: مراجعة الإجابات بـ AI

### Endpoint الجديد

```
POST /api/chatbot/review-answers
```

### المطلوب

الإجابات من الطالب + معلومات الدرس والحصة

### Request Example

```javascript
POST /api/chatbot/review-answers
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Body: {
  "lessonId": 1,
  "sessionId": 1,
  "answers": [
    "الإجابة الأولى على السؤال...",
    "الإجابة الثانية على السؤال...",
    "الإجابة الثالثة..."
  ],
  "questionType": "essay"
}
```

### Response Example

```javascript
{
  "status": "success",
  "data": {
    "review": {
      "score": 85,                    // التقييم من 0-100
      "strengths": "نقاط القوة: ✅...",
      "weaknesses": "نقاط الضعف: ❌...",
      "suggestions": "المقترحات: 💡...",
      "encouragement": "رسالة تشجيع: 🌟..."
    },
    "timestamp": "2026-03-31T10:00:00Z",
    "lessonId": 1,
    "sessionId": 1
  }
}
```

---

## 2️⃣ Frontend: منع الانتقال بدون إجابات

### الخطوات المطلوبة:

#### أ) في `session.js`، أضيف function للتحقق من الإجابات:

```javascript
// ✅ وظيفة جديدة: التحقق من اكتمال الإجابات
function hasAllAnswers() {
  const allTextareas = $$('textarea[id^="q"]');
  const allInputs = $$('input[id^="q"]');
  const allBlockInputs = $$(".block-input, .exp-input");

  // التحقق من أن جميع الـ textareas و inputs بها محتوى
  for (let el of [...allTextareas, ...allInputs, ...allBlockInputs]) {
    if (!el.value || el.value.trim().length === 0) {
      return false;
    }
  }

  return true;
}

// ✅ وظيفة لعرض رسالة خطأ
function showMissingAnswersAlert() {
  showToast(
    "⚠️ يجب أن تملأ جميع الحقول قبل الانتقال للصفحة التالية!",
    "warning",
  );
}

// ✅ وظيفة للانتقال للحصة التالية (بعد التحقق)
function goNextSession() {
  // أولاً: تحقق من الإجابات
  if (!hasAllAnswers()) {
    showMissingAnswersAlert();
    return;
  }

  // ثانياً: احفظ التقدم في الـ Backend
  const user = AUTH.getUser();
  const token = sessionStorage.getItem("token");

  fetch("/api/progress/save", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      lessonId: currentLessonId,
      sessionId: currentSessionId,
      completed: true,
      tabsCompleted: ["objectives", "activities", "quiz"],
      activitiesDone: Array.from(
        { length: session.activities.length },
        (_, i) => i + 1,
      ),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        // ثالثاً: انتقل للحصة التالية
        const nextSessionId = currentSessionId + 1;
        window.location.href = `session.html?lesson=${currentLessonId}&session=${nextSessionId}`;
      }
    })
    .catch((err) => {
      console.error("Error saving progress:", err);
      showToast("❌ حدث خطأ في حفظ التقدم", "error");
    });
}

window.goNextSession = goNextSession;
```

#### ب) في HTML (session.html)، عدّل زر الانتقال:

```html
<!-- البحث عن الزر القديم -->
<button class="btn-primary" onclick="goNextSession()">
  <i class="ph ph-arrow-left"></i> الحصة التالية
</button>

<!-- بدل من: -->
<!-- <button class="btn-primary" onclick="goSession(currentSessionId + 1)"> -->
```

---

## 3️⃣ استخدام AI لمراجعة الإجابات

### في الـ Frontend (عند submit الـ Quiz):

```javascript
// عدّل function في session.js
async function submitQuiz() {
  if (quizSubmitted) return;
  clearInterval(timerInterval);
  quizSubmitted = true;

  const qs = session.quiz.questions;
  let correct = 0;
  const essayAnswers = [];

  // جمع الإجابات
  qs.forEach((qu, qi) => {
    if (qu.type === "essay") {
      const ansEl = $(`qans-${qi}`);
      if (ansEl && ansEl.value) {
        essayAnswers.push(ansEl.value);
      }
    } else if (qu.type === "experiment") {
      const expInputs = $$(`[data-qi="${qi}"]`);
      expInputs.forEach((inp) => {
        if (inp.value) essayAnswers.push(inp.value);
      });
    }
  });

  // إذا كانت هناك essay answers، أرسلها للـ AI للمراجعة
  if (essayAnswers.length > 0) {
    const user = AUTH.getUser();
    const token = sessionStorage.getItem("token");

    try {
      const reviewRes = await fetch("/api/chatbot/review-answers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: currentLessonId,
          sessionId: currentSessionId,
          answers: essayAnswers,
          questionType: "essay",
        }),
      });

      const reviewData = await reviewRes.json();

      if (reviewData.status === "success") {
        // اعرض ملاحظات الـ AI
        const review = reviewData.data.review;
        showAIReview(review);
      }
    } catch (err) {
      console.error("Review error:", err);
    }
  }

  // الباقي من الـ function...
  const score = Math.round((correct / qs.length) * 100);
  const result = {
    score,
    correct,
    total: qs.length,
    date: new Date().toISOString(),
  };
  PROGRESS.saveQuiz(user.id, currentLessonId, currentSessionId, result);
  // ...
}

// وظيفة جديدة: عرض ملاحظات الـ AI
function showAIReview(review) {
  const modal = document.createElement("div");
  modal.className = "ai-review-modal";
  modal.innerHTML = `
    <div class="ai-review-content">
      <h3>📋 ملاحظات الـ AI على إجاباتك</h3>
      
      <div class="review-section">
        <h4>✅ نقاط القوة:</h4>
        <p>${review.strengths || "لا توجد ملاحظات"}</p>
      </div>

      <div class="review-section">
        <h4>⚠️ نقاط للتحسين:</h4>
        <p>${review.weaknesses || "لا توجد ملاحظات"}</p>
      </div>

      <div class="review-section">
        <h4>💡 المقترحات:</h4>
        <p>${review.suggestions || "لا توجد ملاحظات"}</p>
      </div>

      <div class="review-section encouragement">
        <h4>🌟 رسالة تشجيع:</h4>
        <p>${review.encouragement || "استمر في الاجتهاد!"}</p>
      </div>

      <div class="review-score">
        <span class="score-label">التقييم:</span>
        <span class="score-value">${review.score}/100</span>
      </div>

      <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
        تمام، فهمت! 👍
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Animation
  setTimeout(() => modal.classList.add("show"), 100);
}
```

---

## 📝 ملخص الـ Changes

| المكان       | التغيير                            | الفائدة                     |
| ------------ | ---------------------------------- | --------------------------- |
| **Backend**  | `POST /api/chatbot/review-answers` | مراجعة الإجابات بـ AI       |
| **Frontend** | `hasAllAnswers()`                  | منع الانتقال بدون إجابات    |
| **Frontend** | `goNextSession()`                  | الانتقال الآمن + حفظ التقدم |
| **Frontend** | `showAIReview()`                   | عرض ملاحظات الـ AI          |

---

## 🚀 الخطوات العملية:

1. ✅ الـ Backend endpoint موجود (`/api/chatbot/review-answers`)
2. ⏳ أنتظر الآن:
   - أضيف الـ `hasAllAnswers()` و `goNextSession()` في `session.js`
   - أضيف الـ CSS للـ modal
   - أختبر الـ integration

---

## 🧪 Test في Postman:

```javascript
POST /api/chatbot/review-answers
Body: {
  "lessonId": 1,
  "sessionId": 1,
  "answers": [
    "الشغل يحدث عندما تؤثر قوة على جسم فينتقل في اتجاه القوة",
    "يجب أن توجد إزاحة مع القوة"
  ]
}

Response:
{
  "review": {
    "score": 80,
    "strengths": "فهم جيد للمفهوم الأساسي",
    "weaknesses": "لم تذكر أن الإزاحة يجب أن تكون في اتجاه القوة",
    "suggestions": "أضيف أن الإزاحة يجب أن تكون موازية للقوة",
    "encouragement": "عمل جيد! استمر هكذا 🌟"
  }
}
```
