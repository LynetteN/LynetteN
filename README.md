# Confirm-Am: Digital Fraud Guardian 🛡️

**Confirm-Am** is a multi-modal AI-powered guardian designed to protect users from digital fraud and social engineering, specifically tailored for the West African context. It acts as a "second pair of eyes" for suspicious messages, screenshots, and voice notes.

## 🚀 Features

- **Multi-Modal Analysis**: Analyze suspicious WhatsApp/SMS text, screenshots (OCR), and voice notes.
- **Scam-O-Meter**: Instant 1-100 risk score with clear "Low, Medium, High" categorizations.
- **Scam School**: Educational hub teaching users how to spot common regional tactics (NNPC Job Formats, BVN Phishing, etc.).
- **Multi-Language Support**: Fully localized in **English**, **French**, and **Nigerian Pidgin**.
- **WhatsApp Sharing**: One-click sharing of "Verified Scam Alerts" to protect community circles.
- **Human Support Bridge**: Direct links to emergency fraud helplines and specialists.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Motion (Framer Motion)
- **UI Components**: shadcn/ui, Lucide Icons
- **AI Engine**: Google Gemini 1.5 Flash (@google/genai)
- **Styling**: Modern Blue/Slate theme with responsive design

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/confirm-am.git
   cd confirm-am
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/services/gemini.ts`: AI logic and fraud detection system instructions.
- `src/components/`: Core UI components (ScamMeter, AnalysisResult, ScamSchool).
- `src/constants/translations.ts`: Localization engine for English, French, and Pidgin.
- `src/App.tsx`: Main application shell.

## 🛡️ Security & Privacy
Confirm-Am is designed with privacy in mind. Analysis is performed on-the-fly, and sensitive user data is not stored or used for model training in this implementation.

## 📜 License
This project is licensed under the Apache-2.0 License.

---
Confirm-Am 2026 rights reserved
