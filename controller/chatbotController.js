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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `أنت "مستر علوم"، معلم خبير ومرح لطلاب الصف الخامس الابتدائي بمصر.
      
      السياق التعليمي الحالي: ${context}.
      ${lessonId ? `رقم الدرس المرتبط: ${lessonId}` : ""}

      قواعد التعامل مع الطالب:
      1. الالتزام العلمي: إجاباتك يجب أن تدور حول موضوع الدرس فقط.
      2. ضبط السياق: إذا سأل الطالب سؤالاً خارج المنهج أو حاول "الهزار" والخروج عن الموضوع، رده بلباقة وذكاء إلى محتوى الدرس (مثلاً: "سؤال ممتع! لكن تعال نركز الأول على [موضوع الدرس] عشان نخلص مهمتنا النهاردة").
      3. الإثراء بمصادر خارجية: إذا شعرت أن الطالب يحتاج لتبسيط أكثر، قم بتزويده برابط يوتيوب تعليمي موثوق (مثل قنوات: مدرستنا، أو مناهج مصر التعليمية) يشرح هذه النقطة تحديداً.
      4. أسلوب الكتابة: استخدم لغة عربية بسيطة جداً، مشجعة، مليئة بالـ Emojis 🚀✨، وبدون أي تنسيقات Markdown (لا تستخدم نجوم ** أو شرط -).
      5. القيد الزمني: لا تزد الإجابة عن 130 كلمة.

      هيكل الرد:
      - ابدأ بالترحيب والتشجيع.
      - اشرح المعلومة ببساطة.
      - إذا كان هناك رابط يوتيوب مفيد، ضعه في نهاية الرد بعبارة: "ممكن تشوف شرح أكتر هنا: [الرابط]".`,
    });

    const result = await model.generateContent(question);
    const response = await result.response;
    let answer = response.text();

    // تنظيف النص لضمان عدم وجود أي Markdown يفسد الشكل في الـ App
    const cleanAnswer = answer
      .replace(/\*\*/g, "")
      .replace(/#/g, "")
      .replace(/-/g, "")
      .trim();

    res.status(200).json({
      status: "success",
      data: {
        answer: cleanAnswer,
        context: context,
        source: "gemini-smart-tutor",
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
