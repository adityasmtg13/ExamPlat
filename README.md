# 🇮🇳 ExamPlat - e-Examination Platform (ExamPlat)

An AI-powered MERN Stack based examination platform inspired by the **ExamPlat - e-Examination Platform .**. The platform enables students to register, prepare, and participate in competitive examinations such as **JEE**, **NEET**, and other ExamPlat - e-Examination Platform-level entrance exams through a secure government-style portal.

ExamPlat provides secure authentication, student profile management, examination registration, mock payment gateway, downloadable PDF receipts, and a modern dashboard experience.

---

# 🚀 Tech Stack

## Frontend

- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- Bootstrap
- React Icons
- React Hot Toast
- Sonner
- JWT Decode
- Recharts
- html2canvas
- jsPDF

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors
- Multer
- Cloudinary
- PDFKit
- Nodemailer

---

# 📂 Project Structure

```text
ExamPlat/
│
├── client/
│   ├── public/
│   │   ├── logo.png
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── ChartSection.jsx
│   │   │   ├── ExamAnalyticsCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── MockTestList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NavigationButtons.jsx
│   │   │   ├── ProfileDropdown.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── ProfilePhoto.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── QuestionPalette.jsx
│   │   │   ├── QuickServiceCard.jsx
│   │   │   ├── RankPredictionModal.jsx
│   │   │   ├── RegistrationForm.jsx
│   │   │   ├── RegistrationHistory.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── AuditLogs.jsx
│   │   │   ├── ComingSoon.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Marks.jsx
│   │   │   ├── MockCardPayment.jsx
│   │   │   ├── MockExam.jsx
│   │   │   ├── MockInstructions.jsx
│   │   │   ├── MockQRCode.jsx
│   │   │   ├── MockResult.jsx
│   │   │   ├── MockTestPayment.jsx
│   │   │   ├── MockTests.jsx
│   │   │   ├── MockTestsJEE.jsx
│   │   │   ├── MockTestsNEET.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RegisterExam.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── TermsAndConditions.jsx
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   ├── analyticsReportService.js
│   │   │   ├── auditService.js
│   │   │   ├── authService.js
│   │   │   ├── mockTestService.js
│   │   │   ├── paymentService.js
│   │   │   ├── profileService.js
│   │   │   ├── registrationService.js
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   ├── storage.js
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── storage.js
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── ...
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── mockExamController.js
│   │   ├── mockTestController.js
│   │   ├── paymentController.js
│   │   ├── profileController.js
│   │   ├── receiptController.js
│   │   ├── registrationController.js
│   │   └── ...
│   │
│   ├── data/
│   │   ├── jeeQuestions.json
│   │   ├── neetQuestions.json
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── AllowedCandidate.js
│   │   ├── ExamRegistration.js
│   │   ├── MockAttempt.js
│   │   ├── Payment.js
│   │   ├── Question.js
│   │   ├── Student.js
│   │   ├── Test.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── mockExamRoutes.js
│   │   ├── mockTestRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── receiptRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── ...
│   │
│   ├── scripts/
│   │   ├── cleanupMockAttempts.js
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── generateTransactionId.js
│   │   ├── mailSender.js
│   │   ├── paymentEmail.js
│   │   ├── receiptGenerator.js
│   │   ├── seedMockQuestions.js
│   │   ├── sendPaymentConfirmation.js
│   │   ├── validation.js
│   │   └── ...
│   ├── package.json
│   ├── server.js
│   └── .env
│
├── README.md
├── LICENSE
├── package.json
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/adityasmtg13/ExamPlat.git

cd ExamPlat
```

---

## Backend Setup

```bash
cd server
```

### Install Dependencies

```bash
npm install
```

or

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer cloudinary pdfkit cookie-parser nodemailer
```

### Development Dependency

```bash
npm install -D nodemon
```

### Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET

EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=YOUR_EMAIL_PASSWORD
```

### Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
```

### Install Dependencies

```bash
npm install
```

or

```bash
npm install react-router-dom axios react-icons react-hot-toast sonner jwt-decode bootstrap tailwindcss @tailwindcss/vite recharts html2canvas jspdf
```

### Start Frontend

```bash
npm run dev
```

---

## Complete Install Commands

### Frontend only
```bash
cd client
npm install
```

### Backend only
```bash
cd server
npm install
```

### Combined from project root
```bash
npm install --prefix client
npm install --prefix server
```

### Optional explicit dependency install list

#### Frontend
```bash
cd client
npm install axios react react-dom react-router-dom react-icons sonner react-hot-toast bootstrap jwt-decode tailwindcss @tailwindcss/vite recharts html2canvas jspdf
npm install -D vite @vitejs/plugin-react eslint @eslint/js @types/react @types/react-dom eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

#### Backend
```bash
cd server
npm install express mongoose mongodb bcryptjs jsonwebtoken cors dotenv cloudinary multer multer-storage-cloudinary nodemailer pdfkit body-parser
npm install -D nodemon
```

---

# 📦 NPM Packages

## Frontend

| Package | Purpose |
|----------|----------|
| React | Frontend Library |
| Vite | Build Tool |
| React Router DOM | Routing |
| Axios | API Requests |
| Tailwind CSS | Styling |
| Bootstrap | UI Components |
| React Icons | Icons |
| React Hot Toast | Notifications |
| Sonner | Toast Notifications |
| JWT Decode | JWT Parsing |
| Recharts | Interactive Charting and Analytics Visuals |
| html2canvas | Capture Dashboard as Image |
| jsPDF | Analytics PDF Report Generation |

---

## Backend

| Package | Purpose |
|----------|----------|
| Express | Web Framework |
| Mongoose | MongoDB ODM |
| MongoDB Atlas | Cloud Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |
| cors | Cross-Origin Requests |
| Multer | File Uploads |
| Cloudinary | Image Storage |
| PDFKit | PDF Receipt Generation |
| Nodemailer | Email Notifications and Confirmation |
| Cookie Parser | Cookie Handling |
| Nodemon | Development Server |

---

# ✨ Features

## 🔐 Authentication

- Improved JWT Route Protection
- Protected Dashboard Access
- Proper Login / Register Routing
- Public and Private Route Handling
- Authentication Flow Improvements
- Student Registration
- Student Login
- Password Encryption (bcryptjs)

---

## 👨‍🎓 Student Dashboard

- Government-inspired UI
- Personalized dashboard
- Quick Service cards
- Student Details panel
- Latest Notifications
- Audit Logs widget
- Complete Audit History page
- View More navigation
- Profile summary
- Mock Test navigation
- Examination services

---

## 👤 Student Profile

- Mandatory Profile Validation
- Real-time Field Validation
- Aadhaar Number Validation (12 digits)
- Mobile Number Validation
- PIN Code Validation
- Email Validation
- Password Strength Validation
- Father / Guardian Aadhaar Number
- Mother Aadhaar Number
- Improved Error Messages
- Mandatory Government Standard Profile Fields
- Profile Completion Verification before Exam Registration
- View Profile
- Edit Profile
- Upload Profile Photo
- Cloudinary Image Storage
- Parent Details
- Academic Details
- Address Information
- School Information
- Stream Selection
- Class Selection

---

## 📝 Exam Registration

- Register for Exam Quick Action
- Registration disabled until profile is 100% complete
- Hover tooltip and warning notification for incomplete profiles
- Real-time profile completion verification
- Secure route protection before registration
- Register for JEE Main
- Register for NEET
- Automatic Registration Number Generation
- Duplicate Registration Prevention
- Registration History
- Registration Status Tracking

Registration Number Format

```text
EX202600001
```

---

## 📚 Mock Tests

- Official JEE Main Mock Test Interface
- Official NEET Mock Test Interface
- Attempt Tracking
- National Exam Pattern Layout
- Improved Mock Test Dashboard

---

## 📊 Marks Module

- Overall Examination Statistics
- Total Attempts
- Best Percentage
- Average Percentage
- Practice Time
- Expandable Attempt History
- Exam-wise Performance
- Detailed Marks Table
- Time Taken Analysis

---

## 📈 Analytics Dashboard

- Interactive Performance Dashboard
- Performance Trend Graph
- Exam-wise Attempt Analysis
- Best vs Average Performance Charts
- Practice Time Distribution
- Overall Performance Summary
- Visual Analytics using Recharts
- Professional Analytics Report Download (PDF)
- Student Information Summary
- Performance Summary Cards
- High Quality Chart Export
- Multi-page PDF Generation
- Government-style Report Layout
- One-click Analytics Report Download
- Student Information Header
- Automatically Generated Report Date & Time
- Multi-page Report Export
- Printable Performance Summary
- Predict Rank Interface
- Estimated Rank Placeholder
- Predicted College 1 Placeholder
- Predicted College 2 Placeholder
- Predicted College 3 Placeholder

> Rank prediction and college prediction UI have been implemented. AI prediction logic will be integrated in a future update.

---

## 💳 Payment Module

- Mock Payment Flow
- Payment Confirmation Screen
- Email Confirmation Support
- PDF Receipt Generation
- Receipt Download Support
- Multiple payment options including UPI, QR Code, and Card payment
- Payment Number Generation
- Transaction ID Generation
- Payment Status Tracking

Payment Number

```text
PAY202600001
```

Transaction ID

```text
TXN175349873412345
```

---

## 📄 PDF Receipt Generation

After successful payment the student can download a professionally formatted PDF receipt.

Receipt includes

- Receipt Number
- Payment Number
- Transaction ID
- Student Details
- Examination Details
- Payment Method
- Amount Paid
- Payment Status
- Paid Date

Receipt Number

---

# 📊 Analytics PDF Report

Students can download a professionally formatted Analytics Report directly from the Analytics Dashboard.

The report includes:

- Student Details
- Report Information
- Performance Summary
- Total Mock Tests Attempted
- Average Percentage
- Highest Percentage
- Lowest Percentage
- Total Questions Attempted
- Total Practice Hours
- Performance Trend Graph
- Exam Attempts Chart
- Best vs Average Performance
- Practice Time Distribution
- Overall Performance Graph

The report is generated dynamically using **html2canvas** and **jsPDF**, preserving the dashboard charts and styling in a downloadable multi-page PDF.

```text
RCPT202600001
```

---

## 📋 Audit Logs

Students can view all important account activities directly from the dashboard.

Audit logs currently record:

- Student Login
- Student Logout
- Dashboard Access
- Mock Tests Access
- Marks Page Access
- Analytics Dashboard Access
- Profile Page Access
- Settings Page Access
- Exam Registration Access
- Payment Page Access

Features include:

- Latest 3 activities on Dashboard
- Dedicated Audit Logs page
- Timestamp for every activity
- Success Status Indicator
- Reverse Chronological Ordering
- Automatic Logging through Backend APIs

---

## ☁️ Profile Photo

- Upload Photo
- Delete Photo
- Cloudinary Storage
- Live Navbar Synchronization

---

## 🏠 Landing Page

- Government-inspired Hero Section
- Improved UI Theme
- Interactive JEE Practice Sandbox
- Interactive NEET Practice Sandbox
- Sample Questions with Solutions
- Enhanced Responsive Design
- Ministry of Education Inspired
- Modern UI

---

# ✅ Completed Modules

## Backend

- Express Server
- MongoDB Atlas Integration
- Student Authentication
- JWT Authorization
- Password Hashing
- Profile APIs
- Cloudinary Integration
- Image Upload APIs
- Registration APIs
- Payment APIs
- Receipt APIs
- PDF Receipt Generator
- Audit Log APIs
- Activity Tracking
- Authentication Middleware
- Multer Integration
- Email Notification Support

---

## Frontend

- React + Vite
- Responsive UI
- Student Dashboard
- Profile Module
- Mock Tests
- Registration Module
- Payment Module
- Receipt Download
- Protected Routes
- Navbar
- Toast Notifications
- Government Inspired Design
- Recharts Analytics Dashboard
- Rank Prediction UI
- College Prediction UI
- Audit Logs Dashboard
- Audit History Page
- Analytics Report Download

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/adityasmtg13/ExamPlat.git

cd ExamPlat
```

---

## Backend

```bash
cd server
npm install
```

### Create .env

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

Run Backend

```bash
npm run dev
```

---

## Frontend

```bash
cd client
npm install
```

Install Dependencies

```bash
npm install react-router-dom axios react-icons react-hot-toast sonner jwt-decode bootstrap tailwindcss @tailwindcss/vite recharts
```

Run Frontend

```bash
npm run dev
```

---

# 🌐 Local URLs

Frontend

```text
http://localhost:5173
```

Backend

```text
http://localhost:5000
```

---

# 📌 API Endpoints

## Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
```

---

## Profile

```http
GET    /api/profile
PUT    /api/profile
POST   /api/profile/upload-photo
DELETE /api/profile/photo
```

---

## Examination Registration

```http
POST   /api/registration
GET    /api/registration/history
GET    /api/registration/:id
```

---

## Payments

```http
POST   /api/payment/create
POST   /api/payment/complete
GET    /api/payment/history
GET    /api/payment/:id
```

---

## Receipt

```http
GET    /api/receipt/:paymentId
```

---

## Audit Logs

```http
GET    /api/audit
GET    /api/audit/recent
```

---

# 📷 Application Screens

- Landing Page
- Student Registration
- Student Login
- Dashboard
- Student Profile
- Exam Registration
- Registration History
- Payment Selection
- UPI Payment
- QR Payment
- Card Payment
- Payment Success
- PDF Receipt
- Analytics PDF Report
- Audit Logs
- Complete Audit History
- Analytics Report Download
- Responsive Navigation
- Analytics Dashboard
- Marks Module
- Mock Tests Dashboard

---

# 🔜 Upcoming Features

- AI Rank Prediction Engine
- AI College Recommendation Engine
- Personalized Performance Insights
- Admission Probability Prediction
- Smart Study Recommendations
- AI Question Generator
- Online Examination Engine
- Live Timer
- Full Screen Secure Mode
- Negative Marking
- Randomized Questions
- Auto Submission
- Result Generation
- Forgot Password
- OTP Verification
- Email Verification
- Google Login

---

# 👨‍💻 Authors

### Aditya Pulipaka

### Rohith Narayanan

**B.Tech Computer Science and Engineering**

**VIT-AP University**

---

# ⭐ Project Status

🚧 Active Development

Current Version

```text
v1.0.0 Beta
```

---

## 📈 Project Status Table

| Module | Status |
|--------|--------|
| Student Profile Validation | ✅ Complete |
| Mock Tests | ✅ Complete |
| Marks Module | ✅ Complete |
| Analytics Dashboard | ✅ Complete |
| Analytics PDF Report | ✅ Complete |
| Audit Logs | ✅ Complete |
| Rank Prediction UI | 🚧 Frontend Complete |
| College Prediction UI | 🚧 Frontend Complete |
| Payment Gateway | ✅ Complete |
| PDF Receipt | ✅ Complete |
| AI Rank Prediction Logic | 📅 Planned |
| AI College Prediction Logic | 📅 Planned |

---

Built using the MERN Stack to provide a secure, scalable, and modern digital examination platform inspired by India's National Testing Agency (NTA).
