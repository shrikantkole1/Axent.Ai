<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Axent AI - Intelligent Study Planner

Axent AI is an advanced, AI-powered study planning application designed specifically for engineering students to master their curriculum through adaptive schedules, personalized roadmaps, and intelligent tutoring.

<div align="center">
🔗 <strong>Live Demo:</strong> https://axent-ai.vercel.app/
</div>

View your app in AI Studio: https://ai.studio/apps/drive/17XuP-QIYV48R6Nlobs15oKLOkXgBO7jH

---

## 🚀 Tech Stack

### Frontend Core
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** React Context API

### Styling & UI
- **Styling:** Tailwind CSS (Utility-first architecture)
- **Animations:** Framer Motion (Complex transitions & micro-interactions)
- **Icons:** Lucide React
- **Components:** Custom premium UI components (Glassmorphism, Modern Cards)

### Features & Visualization
- **Charts:** Recharts (Analytics & Progress tracking)
- **Calendar:** FullCalendar (Visual scheduling)
- **PDF Generation:** jsPDF & autoTable (Report exports)
- **Validation:** Zod (Schema validation)

### Backend & Services
- **Authentication & Database:** Firebase v12
- **AI Services:** 
  - Google Gemini API (`@google/genai`)
  - Tambo AI (`@tambo-ai/react`)

---

## 💡 Problems Solved

Axent AI addresses the critical challenges faced by engineering students in managing their academic workload:

1.  **Overwhelming Curriculum** 
    *   *Problem:* Engineering syllabi are vast and unstructured, leading to confusion about where to start.
    *   *Solution:* **Branch-Specific Roadmaps** automatically decompose complex subjects into manageable, ordered topics (e.g., breaking "Data Structures" into "Arrays", "Linked Lists", etc.).

2.  **Inefficient Time Management**
    *   *Problem:* Students struggle to balance multiple subjects and often cram before exams.
    *   *Solution:* **Adaptive Study Planning** generates personalized daily schedules based on student energy levels (Morning/Night), available hours, and exam deadlines.

3.  **Lack of Personalized Guidance**
    *   *Problem:* Generic rote learning doesn't address individual weak points.
    *   *Solution:* **Weakness Detection & Confidence Scoring** identifies struggling areas and prioritizes them in the study queue.

4.  **Study Resource Fragmentation**
    *   *Problem:* Wasting time searching for "what to study" within a topic.
    *   *Solution:* **Instant Topic Tutors** provide immediate, AI-generated summaries, key sub-concepts, and time allocation strategies for every single topic.

5.  **Performance Tracking**
    *   *Problem:* Hard to gauge actual "exam readiness" until it's too late.
    *   *Solution:* **Visual Analytics** track completion rates, confidence growth, and overall readiness scores in real-time.

---

## 🧠 AI Architecture

Axent AI employs a hybrid AI strategy to deliver the best results:

### 1. Google Gemini (`gemini-1.5-flash`)
**Role:** The "Brain" of the Chatbot.
- Powers the **Axent Assistant** (the floating chat interface).
- Handles complex technical queries (e.g., "Explain how a red-black tree rebalances").
- Supports **Persona-based Tutoring** (switching between "Socratic Tutor", "Strict Examiner", etc.).
- Maintains context of the user's branch and current active subjects.

### 2. Tambo AI
**Role:** The "Architect" of Structure.
- **Roadmap Generation:** Generates structured JSON data for subjects and topics.
- **Adaptive Planning:** Analyzes student constraints to build the logic for the study schedule.
- **Topic Details:** Generates concise 3-sentence summaries and key concepts for topic cards.


---

## Run Locally

**Prerequisites:**  Node.js

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create `.env.local` by copying `.env.example` and adding your keys:
   - `VITE_GEMINI_API_KEY` – [Get from Google AI Studio](https://aistudio.google.com/apikey) (Required for Chatbot)
   - `VITE_TAMBO_API_KEY` – [Get from Tambo AI](https://tambo.co/dashboard) (Required for Roadmaps & Planning)

3. **Run the app:**
   ```bash
   npm run dev
   ```
