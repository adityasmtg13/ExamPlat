# 🇮🇳 National Exam Platform (ExamPlat)

An AI-powered MERN Stack based examination platform inspired by the **National Testing Agency (NTA)**. The platform enables students to register, prepare, and participate in competitive examinations such as **JEE**, **NEET**, and other national-level entrance exams through a secure government-style portal.

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

---

# 📂 Project Structure

```text
ExamPlat/
│
├── client/
│   ├── public/
│   ├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   ├── ProfileForm.jsx
│   │   ├── ProfileDropdown.jsx
│   │   ├── ProfilePhoto.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── RegistrationHistory.jsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── MockTests.jsx
│   │   ├── RegisterExam.jsx
│   │   ├── Payment.jsx
│   │   ├── MockUPIPayment.jsx
│   │   ├── MockQRCode.jsx
│   │   ├── MockCardPayment.jsx
│   │   └── PaymentSuccess.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── registrationService.js
│   │   ├── paymentService.js
│   │   └── receiptService.js
│   │
│   └── ...
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── registrationController.js
│   │   ├── paymentController.js
│   │   └── receiptController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Student.js
│   │   ├── ExamRegistration.js
│   │   └── Payment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── receiptRoutes.js
│   │
│   ├── utils/
│   │   ├── validation.js
│   │   ├── generateTransactionId.js
│   │   └── receiptGenerator.js
│   │
│   └── server.js
│
├── README.md
└── .gitignore
```

---

# ✨ Features

## 🔐 Authentication

- Student Registration
- Student Login
- JWT Authentication
- Protected Routes
- Public Routes
- Password Encryption (bcryptjs)

---

## 👨‍🎓 Student Dashboard

- Government-inspired UI
- Personalized dashboard
- Quick service cards
- Profile summary
- Mock test navigation
- Examination services

---

## 👤 Student Profile

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

## 📝 Examination Registration

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

## 💳 Mock Payment Gateway

Three payment options are available.

### UPI Payment

- Simulated UPI payment
- Transaction generation

### QR Code Payment

- QR Code based payment simulation

### Card Payment

- Card Number
- Card Holder Name
- Expiry
- CVV

Features

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

```text
RCPT202600001
```

---

## ☁️ Profile Photo

- Upload Photo
- Delete Photo
- Cloudinary Storage
- Live Navbar Synchronization

---

## 🏠 Landing Page

- Ministry of Education Inspired
- Responsive Design
- Government Theme
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
- Authentication Middleware
- Multer Integration

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
npm install react-router-dom axios react-icons react-hot-toast sonner jwt-decode bootstrap tailwindcss @tailwindcss/vite
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
- Responsive Navigation

---

# 🔜 Upcoming Features

## Examination System

- AI Question Generator
- Online Examination Engine
- Live Timer
- Full Screen Secure Mode
- Negative Marking
- Randomized Questions
- Auto Submission
- Result Generation

---

## Student Features

- Performance Analytics
- AI Performance Recommendation
- College Predictor
- Rank Prediction
- Subject-wise Analysis
- Leaderboard
- Exam Calendar
- Hall Ticket Download

---

## Administration

- Admin Dashboard
- Student Management
- Question Bank Management
- Examination Management
- Result Management
- Payment Reports
- Receipt Management

---

## Authentication

- Forgot Password
- OTP Verification
- Email Verification
- Google Login

---

## Notifications

- Email Notifications
- SMS Notifications
- Push Notifications

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
v0.7.0 Beta
```

---

## 📌 Current Progress

| Module | Status |
|----------|--------|
| Authentication | ✅ Complete |
| Student Profile | ✅ Complete |
| Dashboard | ✅ Complete |
| Mock Tests | ✅ Complete |
| Exam Registration | ✅ Complete |
| Payment Gateway | ✅ Complete |
| PDF Receipt Generation | ✅ Complete |
| Admin Dashboard | 🚧 In Progress |
| Online Examination Engine | 🚧 In Progress |
| AI Features | 🚧 Planned |

---

Built using the MERN Stack to provide a secure, scalable, and modern digital examination platform inspired by India's National Testing Agency (NTA).
