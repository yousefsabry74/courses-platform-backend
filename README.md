📚 Courses Platform Backend — Features Documentation
🛠️ Tech Stack
Technology	Version	Purpose
Node.js + Express.js	v5.x	HTTP Server & Routing
MongoDB + Mongoose	v9.x	Database & ODM
JSON Web Token (JWT)	v9.x	Authentication
bcrypt	v6.x	Password Hashing
Joi	v18.x	Input Validation
Google Generative AI (Gemini)	v0.24.x	AI Features
dotenv	v17.x	Environment Variables
CORS	v2.x	Cross-Origin Resource Sharing
🔐 Authentication & Authorization
User Registration — إنشاء حساب جديد بـ username، email، password، age، role
User Login — تسجيل الدخول بالـ email والـ password وإرجاع JWT Token
JWT Token — يُصدر عند التسجيل والدخول، صلاحيته ساعة واحدة
Token Verification Middleware — يتحقق من وجود وصحة الـ token في كل endpoint محمي
Role-Based Access Control (RBAC) — يدعم دورين: user و admin
عمليات الإضافة، التعديل، الحذف، وتوليد الكويز متاحة للـ admin فقط
Password Hashing — كل كلمات المرور مشفرة بـ bcrypt بـ 10 salt rounds
Password Hidden from Responses — الحقل password محمي بـ select: false في الـ Schema
📚 Course Management (CRUD)
GET /api/courses/ — جلب كل الكورسات مع Pagination (page, limit)
GET /api/courses/course — بحث وفلترة الكورسات بـ:
title — بحث نصي (case-insensitive)
price — سعر محدد
minPrice / maxPrice — نطاق السعر
sort — ترتيب النتائج (تصاعدي/تنازلي على أي field)
Pagination كامل
POST /api/courses/ (Admin only) — إضافة كورس جديد مع validation
PATCH /api/courses/:id (Admin only) — تعديل بيانات كورس موجود
DELETE /api/courses/:id (Admin only) — حذف كورس
🤖 AI Integration — Google Gemini
Auto-Generate Course Description

عند إضافة كورس بدون description، يتم توليدها تلقائياً بواسطة Gemini AI
البرومبت يولّد وصفاً احترافياً وجذاباً باللغة العربية
AI Quiz Generation — POST /api/courses/:id/generate-quiz (Admin only)

بناءً على وصف الكورس، يولّد Gemini 3 أسئلة MCQ باللغة العربية
الأسئلة تُحفظ تلقائياً في الـ quizzes field داخل الكورس
الرد بصيغة JSON منظّمة: question, options[], correctAnswer
👥 User Management
GET /api/users/ (Authenticated only) — جلب كل المستخدمين مع Pagination
الـ password محذوف من الـ response تلقائياً
POST /api/users/register — تسجيل مستخدم جديد
POST /api/users/login — تسجيل الدخول
🏗️ Data Models
User Model
Field	Type	Notes
username	String	Required, Unique, Trimmed
email	String	Required, Unique, Lowercase
password	String	Required, min 6 chars, Hidden from response
age	Number	Optional, 10–100
role	String	user or admin — Required
createdAt	Date	Auto-set, Immutable
updatedAt	Date	Auto-updated
Course Model
Field	Type	Notes
title	String	Required
description	String	Required (AI-generated if not provided)
price	Number	Required
quizzes	Array	question, options[], correctAnswer — AI-generated
reviews	Array	userId (ref User), ratings (1–5), comment
✅ Input Validation (Joi)
User Registration Validation:

username: alphanumeric, 3–30 chars
password: 6–30 chars
email: valid format, .com/.net only
age: 10–100
role: user or admin (default: user)
Course Create Validation:

title: required string
price: required number
description: optional (AI fills if missing)
reviews: optional array with ratings (1–5) and comment
Course Update Validation: نفس الحقول لكن كلها optional

⚙️ Middleware
Middleware	Purpose
verifyToken
يتحقق من صحة JWT Token في الـ Authorization header
allowedTo(...roles)
يتحقق من أن الـ user له الصلاحية المطلوبة
asyncHandler	يلتف على الـ async functions ويمرر الـ errors تلقائياً
errorHandler
Global error handler يرجع JSON موحّد لأي خطأ
🌐 API Endpoints Summary
Courses — /api/courses
Method	Endpoint	Auth	Role	Description
GET	/	❌	Any	جلب كل الكورسات (Paginated)
GET	/course	❌	Any	فلترة وبحث في الكورسات
POST	/	✅	Admin	إضافة كورس جديد
PATCH	
/:id
✅	Admin	تعديل كورس
DELETE	
/:id
✅	Admin	حذف كورس
POST	/:id/generate-quiz	✅	Admin	توليد كويز بالـ AI
Users — /api/users
Method	Endpoint	Auth	Role	Description
POST	/register	❌	Any	تسجيل مستخدم جديد
POST	/login	❌	Any	تسجيل الدخول
GET	/	✅	Any	جلب كل المستخدمين
🔒 Security Features
كلمات المرور مشفرة بـ bcrypt
المصادقة بـ JWT مع انتهاء صلاحية تلقائي
الـ password لا يظهر في أي response
CORS مُفعّل لدعم الـ Frontend
Environment variables لحماية البيانات الحساسة (DB URL، JWT Secret، Gemini Key)
Role-based protection لكل العمليات الحساسة
