# 🇮🇳 National Exam Platform

An AI-powered MERN Stack based examination platform inspired by the National Testing Agency (NTA), built to help students prepare for competitive examinations such as **JEE**, **NEET**, and other national-level entrance exams.

The platform provides secure authentication, personalized student profiles, AI-powered examination services, mock tests, analytics, rank prediction, and much more.

---

# 🚀 Tech Stack

## Frontend

- React (Vite)
- React Router DOM
- Axios
- React Icons
- React Hot Toast
- Tailwind CSS

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

---

# 📂 Project Structure

```text
ExamPlatform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# ✨ Features

## Authentication

- Student Registration
- Student Login
- JWT Authentication
- Protected Routes
- Public Routes
- Password Encryption using bcrypt

---

## Student Dashboard

- Government-style Dashboard UI
- Personalized Welcome
- Student Profile Summary
- Quick Services
- Mock Test Section
- AI Analytics Section
- Rank Predictor
- College Predictor

---

## Student Profile

- View Profile
- Edit Profile
- Update Name
- Update Email
- Update Contact Details
- Parent Information
- Address Details
- Academic Information
- Stream Selection
- Class Selection
- School Information

---

## Profile Photo

- Upload Profile Picture
- Cloudinary Image Storage
- Real-time Profile Image Updates
- Navbar Profile Synchronization

---

## Landing Page

- Government Portal Inspired Design
- Ministry of Education Theme
- National Exam Platform Branding
- Latest Notifications
- Upcoming Examinations
- Official Quick Links
- Responsive Layout

---

# ✅ Completed

## Backend

- Express Server
- MongoDB Atlas Integration
- Student Authentication
- JWT Authorization
- Password Hashing
- Protected APIs
- Student Profile APIs
- Profile Update APIs
- Cloudinary Integration
- Image Upload APIs
- Middleware Authentication
- Multer Integration

---

## Frontend

- React + Vite Setup
- Tailwind CSS
- Responsive UI
- Government Inspired Landing Page
- Student Dashboard
- Student Profile Page
- Cloudinary Image Upload
- Dynamic Navbar
- Profile Dropdown
- Toast Notifications
- Protected Routing
- Authentication Services
- Profile Services

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/adityasmtg13/ExamPlat.git

cd ExamPlatform
```

---

## Backend Setup

```bash
cd server

npm install
```

### Install Dependencies

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer cloudinary
```

```bash
npm install --save-dev nodemon
```

---

### Create .env

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

---

### Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install
```

### Install Dependencies

```bash
npm install react-router-dom axios react-icons react-hot-toast jwt-decode
```
```bash
npm install tailwindcss @tailwindcss/vite
```

---

### Run Frontend

```bash
npm run dev
```


---

# 🌐 Local URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 📌 Available APIs

## Authentication

```http
POST /api/auth/register

POST /api/auth/login
```

---

## Student Profile

```http
GET /api/profile

PUT /api/profile

POST /api/profile/upload-photo

DELETE /api/profile/photo
```

---

# 📸 Screens

- Government Styled Landing Page
- Student Login
- Student Registration
- Student Dashboard
- Student Profile
- Cloudinary Profile Upload
- Responsive Navbar
- Government Inspired Footer

---

# 🔜 Upcoming Features

- AI Mock Test Generator
- Online Examination Engine
- Live Exam Timer
- Negative Marking System
- Subject-wise Analytics
- Performance Graphs
- AI Performance Recommendations
- AI Rank Prediction
- College Predictor
- Question Bank Management
- Admin Dashboard
- Student Management
- Leaderboard
- Forgot Password
- OTP Verification
- Email Verification
- Push Notifications
- Payment Gateway
- Exam Certificates
- Downloadable Scorecards

---

# 👨‍💻 Authors

### Aditya Pulipaka

- B.Tech CSE, VIT-AP University
- GitHub: https://github.com/adityasmtg13

### Contributors

- Team Members of National Exam Platform

---

# ⭐ Project Status

🚧 Active Development

Current Version

```
v0.3.0 Beta
```

More AI-powered features and examination modules are under development.
