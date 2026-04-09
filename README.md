Confirm-Am is a multi-modal AI-powered guardian designed to protect users from the rising tide of digital fraud and social engineering, specifically tailored for the West African context. Built during the "AI for Social Good" Buildathon, it acts as a "second pair of eyes" for suspicious digital interactions.

The Problem
Digital fraud in West Africa often exploits emotional triggers (urgency, fear, or desperation) and local linguistic nuances (Pidgin English, regional slang) that traditional security filters miss. Victims often react impulsively to "Emergency Scams" or "Fake Job Offers" before they have a chance to think logically.

The Solution
Confirm-Am leverages Gemini 1.5 Flash to perform deep intent and sentiment analysis on suspicious content. It doesn't just look for keywords; it understands the psychology of the scam.

Key Features
Multi-Modal Analysis: Analyze suspicious WhatsApp/SMS text, screenshots (OCR), and voice notes (Audio-to-Intent).

Scam-O-Meter: Provides a 1-100 risk score with clear "Low, Medium, High" categorizations.

Scam School: An educational hub teaching users how to spot "NNPC Job Formats," "BVN Phishing," and "Emergency Traps."

Multi-Language Support: Fully localized in English, French, and Nigerian Pidgin to reach a wider, more vulnerable audience.

WhatsApp Sharing: One-click sharing of "Verified Scam Alerts" to protect family and community circles.

Human Support Bridge: Direct links to emergency fraud helplines and WhatsApp specialists.
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2addc7d1-8c59-4b1d-b78d-2407c30b5ac8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
