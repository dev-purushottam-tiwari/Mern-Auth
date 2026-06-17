# 🔐 MERN Authentication System

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-green" />
  <img src="https://img.shields.io/badge/Node.js-Backend-brightgreen" />
  <img src="https://img.shields.io/badge/React-Frontend-blue" />
  <img src="https://img.shields.io/badge/MongoDB-Database-success" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" />
</p>

## 📌 Overview

A secure and modern authentication system built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). This application provides complete user authentication with email verification, password reset functionality, JWT-based authorization, and protected routes.

## ✨ Features

* 🔑 User Registration & Login
* 📧 Email Verification
* 🔒 JWT Authentication
* 🍪 Secure HTTP-Only Cookies
* 🔄 Forgot Password & Reset Password
* 🛡️ Protected Routes
* 👤 User Profile Management
* ⚡ Real-Time Authentication State
* 📱 Responsive UI
* 🌙 Modern User Interface

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT (JSON Web Token)
* Bcrypt.js
* Nodemailer

### Database

* MongoDB
* Mongoose

## 📂 Project Structure

```bash
mern-auth/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/dev-purushottam-tiwari/mern-auth.git
cd mern-auth
```

### Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

## ⚙️ Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

CLIENT_URL=http://localhost:5173
```

## ▶️ Run the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

## 🔑 Authentication Flow

1. User Registration
2. Email Verification
3. Login Authentication
4. JWT Token Generation
5. Protected Route Access
6. Forgot Password Request
7. Password Reset via Email

## 📸 Screenshots

Add screenshots of:

* Login Page
* Register Page
* Email Verification Page
* Dashboard
* Forgot Password Page

## 🔒 Security Features

* Password Hashing with Bcrypt
* JWT Token Authentication
* HTTP-Only Cookies
* Protected API Routes
* Environment Variables Protection
* Secure Password Reset Links

## 📈 Future Improvements

* Google OAuth Login
* GitHub OAuth Login
* Two-Factor Authentication (2FA)
* User Activity Logs
* Admin Dashboard
* Account Lockout Protection

## 👨‍💻 Author

**Purushottam Kumar Tiwari**

* Full Stack MERN Developer
* Java & OOP Enthusiast
* B.Tech CSE (2026)

### Connect With Me

* GitHub: https://github.com/dev-purushottam-tiwari
* LinkedIn: https://linkedin.com/in/purushottam-kr-tiwari

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

Made with ❤️ using MERN Stack
