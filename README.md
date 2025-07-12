# 📝 DailyMe — Blogging Platform

**DailyMe** is a modern, full-stack blogging web application that allows users to **register, log in, and share personal blogs**. Built using **Next.js**, **Redux Toolkit**, **FastAPI**, and **PostgreSQL**, DailyMe enables both casual readers and content creators to explore, write, and interact through beautifully designed blog pages. Featuring **image upload via Cloudinary**, **JWT-based auth**, and a responsive UI, DailyMe offers a seamless and dynamic blogging experience.

---

## 🚀 Live Demo

🔗 [Open DailyMe Blog](https://dailyme-seven.vercel.app/) in your browser to try it out.

**Demo Credentials**  
- Email: `admin@gmail.com`  
- Password: `admin@123`  

> _Note: If the data doesn't load instantly, the backend may be in sleep mode (Render free tier). The server will respond after a few seconds._

---

## ✨ Features

### 📝 Blog Creation & Display
- Authenticated users can create blogs with **title**, **content**, and optional **image upload**.
- All blogs display on the homepage with **"Read More"** options for full blog views.

### 🔐 Secure Authentication
- **JWT-based login/register system**
- Tokens are stored as cookies and used for secure, protected routes.

### 🌆 Image Upload with Cloudinary
- Blogs can include images uploaded via **Cloudinary**.
- Fallback/default image shown when no image is uploaded.

### 🔍 Browse & Filter Blogs
- All users can explore blogs.
- Logged-in users can view their own blogs in a personalized dashboard.

### ❤️ Like & Delete Functionality
- Visitors can like blogs.
- Authors can delete their own content.

### 📦 State Management (Redux Toolkit)
- App-wide state managed with **Redux Toolkit** for authentication and blog storage.
- Optimized for async operations and seamless user experience.

> Redux slices are located in the `/redux` directory.

### 🎨 Responsive UI with Tailwind CSS
- Fully responsive design using **Tailwind CSS**
- Clean layout and mobile-friendly blog cards, modals, and forms.

---

## ✅ TODO / Upcoming Features

- ✏️ Edit Blog Functionality  
- 🔍 Tag-based Blog Filtering  
- 🧠 AI-Assisted Blog Writing  
- 📱 Mobile PWA Support  
- 💬 Comment System  
- 📊 Blog Analytics (Views, Likes, Reads)

---

## 🛠️ Tech Stack

| Layer      | Technology                               |
|------------|-------------------------------------------|
| Frontend   | Next.js, React, Redux Toolkit, Tailwind CSS |
| Backend    | FastAPI, Python                          |
| Database   | PostgreSQL (via pgAdmin)                 |
| Image Upload | Cloudinary                             |
| Auth       | JWT (Cookies)                            |
| Deployment | Vercel (Frontend), Render (Backend)      |

---

## 👤Author
Built by Karan Negi.
Feel free to open issues or contribute to the project!
