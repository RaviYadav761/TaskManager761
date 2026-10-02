# Task Management System with Smart Chatbot
**TYCS SEM 5 Project Submission**

### Student Details
- **Name:** Ravi Avdesh Yadav
- **Roll No:** 47
- **Class / Semester:** TYCS SEM 5 (Third Year Computer Science)
- **Academic Year:** 2025–2026

---

## 📌 Project Overview
**Task Management System with Smart Chatbot** is a modern, responsive web-based application built to help students, developers, and individuals organize, manage, and track daily tasks, assignments, deadlines, and project deliverables. 

It features an intelligent **Smart Chatbot** that provides real-time task assistance, day planning, urgent priority filtering, and progress summaries.

---

## 🚀 Key Features

1. **Task Management**:
   - Create new tasks with title, description, category, priority, and due dates.
   - Edit existing tasks anytime.
   - Delete tasks with confirmation.
   - Mark tasks as completed or pending with one-click toggles.

2. **Organization & Views**:
   - **View Tabs**: All Tasks, Pending Tasks, Completed Tasks, and Due Today.
   - **Priority Levels**: High, Medium, and Low with distinct visual indicators.
   - **Category Tagging**: College Project, Assignments, Exams & Viva, Study, Personal.
   - **Real-time Search**: Instant search by task title, description, or category.
   - **Sorting**: By due date (earliest/latest), priority (high/low), title (A-Z), and created date.

3. **Dashboard Analytics**:
   - Metrics cards for Total Tasks, Pending Tasks, Completed Tasks, and Due Today.
   - Visual progress bar showing completion rate percentage.
   - Priority distribution summary.

4. **Smart Chatbot Assistant**:
   - Accessible via floating launcher or top navigation.
   - Quick prompt chips:
     - 📋 *Show Pending Tasks*
     - 📅 *What's Due Today?*
     - 🔥 *High Priority Tasks*
     - 📊 *Completion Progress Summary*
     - 💡 *Intelligent Day Plan & Task Schedule*
   - Chat-based task creation (e.g., type `add Complete physics report`).

5. **College Submission / Viva Ready**:
   - Built-in **Project Synopsis Modal** with complete student and project information.
   - LocalStorage persistence (preserves tasks between browser refreshes).
   - Responsive design tailored for mobile, tablet, and desktop screens.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React.js 19
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Storage:** HTML5 LocalStorage API

---

## 💻 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) or [http://localhost:5174](http://localhost:5174) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🎯 Viva Q&A Guide for Ravi

- **Q: Why React.js was chosen?**  
  *A: React provides component reusability, virtual DOM for fast UI rendering, and efficient state management using hooks like `useState` and `useEffect`.*
- **Q: How does the Smart Chatbot work without requiring external paid API keys?**  
  *A: The chatbot contains an intelligent client-side NLP parser that analyzes the user's active task state in memory, allowing instant queries for pending items, deadlines, priority tasks, and schedule planning reliably even offline.*
- **Q: Where is data stored?**  
  *A: In browser `localStorage`, ensuring data persists across page refreshes.*
