const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askChatbot = async (req, res) => {
  const { question, lessonId, context } = req.body;

  if (!question || !context) {
    return res.status(400).json({
      status: "error",
      message: "السؤال والـ context مطلوب",
    });
  }

  try {
    // استخدم الإصدار الثابت حالياً gemini-1.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // وضع التعليمات هنا يضمن فصلها تماماً عن سؤال المستخدم
      systemInstruction: `أنت معلم ذكي متخصص في تعليم طلاب الصف الخامس الابتدائي الفيزياء.
      السياق الحالي: ${context}.
      ${lessonId ? `الدرس رقم: ${lessonId}` : ""}
      
      قواعد الإجابة الصارمة:
      1. استخدم لغة عربية بسيطة وودية جداً.
      2. أضف emojis مناسبة.
      3. كن مشجعاً جداً.
      4. اشرح بأمثلة واقعية.
      5. لا تزد الإجابة عن 150 كلمة.
      6. الرد بالعربية فقط.
      7. ممنوع استخدام أي تنسيقات Markdown مثل النجوم (**) أو الشُرط (-). ابدأ النص مباشرة.`,
    });

    const result = await model.generateContent(question);
    const response = await result.response;
    let answer = response.text();

    // تنظيف إضافي لضمان عدم وجود أي Markdown عالق
    const cleanAnswer = answer
      .replace(/\*\*/g, "") // إزالة النجوم تماماً
      .replace(/#/g, "") // إزالة علامات العناوين
      .trim(); // إزالة المسافات الزائدة في البداية والنهاية

    res.status(200).json({
      status: "success",
      data: {
        answer: cleanAnswer,
        context: context,
        source: "gemini",
        timestamp: new Date().toISOString(),
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

// ═══════════════════════════════════════════════════════════════
// 🤖 REVIEW ANSWERS — استخدام AI لمراجعة الإجابات
// ═══════════════════════════════════════════════════════════════
const reviewAnswers = async (req, res) => {
  const { lessonId, sessionId, answers, questionType } = req.body;

  if (!answers || !lessonId || !sessionId) {
    return res.status(400).json({
      status: "error",
      message: "الإجابات و الدرس والحصة مطلوبة",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // صياغة الـ prompt للـ review
    const reviewPrompt = `أنت معلم متخصص في تقييم إجابات طلاب الصف الخامس الابتدائي في العلوم (فيزياء).
الحصة: درس رقم ${lessonId}، الحصة رقم ${sessionId}

المطلوب: راجع الإجابة التالية وأعطيها تقييماً وملاحظات بناءً على:
1. الصحة العلمية
2. الفهم الكامل
3. استخدام المصطلحات الصحيحة
4. الوضوح والشمولية

الإجابة:
${Array.isArray(answers) ? answers.join("\n---\n") : answers}

الرجاء إعطاء:
1. تقييم نسبة الإجابة (0-100)
2. نقاط القوة في الإجابة
3. نقاط الضعف والأخطاء
4. مقترحات للتحسين
5. ملاحظات تشجيعية للطالب

الصيغة: JSON بهذا الشكل:
{
  "score": 85,
  "strengths": "نقاط القوة...",
  "weaknesses": "نقاط الضعف...",
  "suggestions": "المقترحات...",
  "encouragement": "رسالة تشجيع..."
}`;

    const result = await model.generateContent(reviewPrompt);
    const response = await result.response;
    let reviewText = response.text();

    // محاولة استخراج JSON من الـ response
    const jsonMatch = reviewText.match(/\{[\s\S]*\}/);
    let reviewData = {};

    if (jsonMatch) {
      try {
        reviewData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        // في حالة فشل parsing، نرسل الـ text كما هو
        reviewData = {
          score: 70,
          feedback: reviewText,
        };
      }
    } else {
      reviewData = {
        score: 70,
        feedback: reviewText,
      };
    }

    res.status(200).json({
      status: "success",
      data: {
        review: reviewData,
        timestamp: new Date().toISOString(),
        lessonId,
        sessionId,
      },
    });
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({
      status: "error",
      message: "حدث خطأ في مراجعة الإجابات",
    });
  }
};

module.exports = { askChatbot, reviewAnswers };
