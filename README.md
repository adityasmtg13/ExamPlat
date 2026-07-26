# 🇮🇳 National Exam Platform

An AI-powered MERN Stack based examination platform inspired by the National Testing Agency (NTA), built to help students prepare for competitive examinations such as **JEE**, **NEET**, and other national-level entrance exams.

The platform provides secure authentication, personalized student profiles, mock test preparation, exam registration flows, and a government-style student dashboard experience.

---

# 🚀 Tech Stack

## Frontend

- React (Vite)
- React Router DOM
- Axios
- React Icons
- React Hot Toast
- Sonner
- Bootstrap
- JWT Decode

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
ExamPlat/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Button.jsx
│       │   ├── FormField.jsx
│       │   ├── Input.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProfileDropdown.jsx
│       │   ├── ProfileForm.jsx
│       │   ├── ProfilePhoto.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── PublicRoute.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── MockTests.jsx
│       │   ├── Profile.jsx
│       │   ├── Register.jsx
│       │   ├── RegisterExam.jsx
│       │   └── Home.jsx
│       ├── services/
│       │   ├── authService.js
│       │   └── profileService.jsx
│       ├── utils/
│       │   ├── profileUtils.js
│       │   └── validation.js
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── storage.js
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── profileRoutes.js
│   ├── utils/
│   │   └── validation.js
│   └── server.js
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
- Password Encryption using bcryptjs

---

## Student Dashboard

- Government-style dashboard UI
- Personalized student welcome section
- Quick services section
- Mock test access
- Profile summary and navigation
- Student action cards for exam preparation

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

## Exam & Mock Test Flow

- Exam registration page
- Mock tests page
- Student-focused preparation navigation
- Protected access for exam-related modules

---

## Profile Photo

- Upload profile picture
- Cloudinary image storage
- Real-time profile image updates
- Navbar profile synchronization

---

## Landing Page

- Government portal inspired design
- Ministry of Education themed layout
- National exam platform branding
- Responsive layout for desktop and mobile

---

# ✅ Completed

## Backend

- Express server setup
- MongoDB Atlas integration
- Student authentication
- JWT authorization
- Password hashing with bcryptjs
- Protected APIs
- Student profile APIs
- Profile update APIs
- Cloudinary integration
- Image upload APIs
- Middleware authentication
- Multer integration

---

## Frontend

- React + Vite setup
- Responsive UI
- Government inspired landing page
- Student dashboard
- Student profile page
- Exam registration page
- Mock tests page
- Cloudinary profile upload
- Dynamic navbar
- Profile dropdown
- Toast notifications
- Protected routing
- Authentication services
- Profile services

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

```text
http://localhost:5173
```

Backend

```text
http://localhost:5000
```

---

# 📌 Available APIs

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Student Profile

```http
GET /api/profile
PUT /api/profile
POST /api/profile/upload-photo
DELETE /api/profile/photo
```

---

# 📸 Screens

- Government styled landing page
- Student login
- Student registration
- Student dashboard
- Student profile
- Cloudinary profile upload
- Responsive navbar
- Government inspired footer

---

# 🔜 Upcoming Features

- AI mock test generator
- Online examination engine
- Live exam timer
- Negative marking system
- Subject-wise analytics
- Performance graphs
- AI performance recommendations
- AI rank prediction
- College predictor
- Question bank management
- Admin dashboard
- Student management
- Leaderboard
- Forgot password
- OTP verification
- Email verification
- Push notifications
- Payment gateway
- Exam certificates
- Downloadable scorecards

---

# 👨‍💻 Authors

### Aditya Pulipaka
### Rohith Narayanan

- B.Tech CSE, VIT-AP University


# ⭐ Project Status

🚧 Active Development

Current Version

```text
v0.4.0 Beta
```

More AI-powered features and examination modules are under development.
