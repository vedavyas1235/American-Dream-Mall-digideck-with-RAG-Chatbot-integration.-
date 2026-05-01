<div align="center">
  <h1>🏬 American Dream Mall <br/> Digital Platform/Digital Deck & AI Chatbot</h1>
  <p><strong>A high-performance modern web application built as a premium digital sales experience, featuring an integrated context-aware AI Assistant powered by a custom Retrieval-Augmented Generation (RAG) backend.</strong></p>
</div>

---

## 📖 Project Overview

This project serves as a comprehensive, B2B-focused digital sales and leasing platform for the American Dream Mall—North America's largest entertainment and retail complex. It is designed to attract ultra-luxury retail partners, major brands, and global sponsors by showcasing the property's immense scale, architectural grandeur, and unprecedented foot traffic.

The platform has been designed into a modular, non-linear digital deck. It features a sophisticated **Events & Platform** chapter that guides users through a deep-dive of the mall's 40M+ annual audience and versatile venue technical specifications via a split-screen interactive directory.

To provide immediate, data-backed answers, the platform features a fully custom **RAG-powered AI Assistant** integrated into the final "Partner With Us" stage. The chatbot is bound strictly to internal research reports, ensuring it provides accurate, non-hallucinated leasing figures and architectural statistics.

---

## ✨ Core Features

*   **Interactive 3D Mall Explorer:** A custom Three.js/React-Three-Fiber 3D particle visualization of the mall's footprint with animated zones (Luxury, Entertainment, Dining).
*   **Non-Linear Persona Journeys:** Specialized presentation paths tailored for Retailers, Brand Sponsors, and Event Organizers, branching from a dynamic 3-portal Opportunity Configurator.
*   **Premium Luxury UI & Navigation:** Swipe gesture support, cinematic directional slide transitions, fixed journey progress dots, and precision-aligned circular navigation UI to match high-end aesthetics.
*   **Intelligent RAG Assistant:** An integrated floating AI Chatbot provides instant, data-driven answers parsed exclusively from a confidential American Dream Mall Research Report, connected live to a Hugging Face Space backend.
*   **Modular Events & Platform Architecture:** A restructured sequence including Events Overview, interactive Venue Directory, and Event History with cascading interaction cues.

---

## 🛠️ Technology Stack

### Frontend Architecture
*   **Core:** React 18 with Vite for ultra-fast localized compilation.
*   **Language:** TypeScript for strict type-safety and robust enterprise development.
*   **Styling:** Vanilla CSS with custom tailored CSS variables—eschewing heavy utility frameworks to maintain pixel-perfect custom luxury animations.
*   **Animation Engine:** Framer Motion for scroll-triggered viewport reveals and structural layout transitions.
*   **3D Graphics Engine:** Three.js & `@react-three/fiber` for the interactive Mall Explorer data visualization.

### RAG Backend & AI Architecture
*   **Framework:** FastAPI & Uvicorn for asynchronous API bridging.
*   **RAG Engine:** LangChain orchestration.
*   **Vector Database:** Local persistent ChromaDB.
*   **Embeddings Model:** HuggingFace `sentence-transformers/all-MiniLM-L6-v2`.
*   **LLM Engine:** via OpenRouter API.

### Deployment
*   **Frontend** → Vercel (auto-deploys on GitHub push)
*   **RAG Backend** → HuggingFace Spaces (Dockerized)
*   **CI/CD** → GitHub Actions (automated build checks)

---

## 🤖 RAG Chatbot Implementation Details

The implementation of the chatbot relies on a custom-built Retrieval-Augmented Generation (RAG) pipeline residing in the `american-dream-mall-rag` subdirectory. 

1. **Ingestion & Embedding (`ingest.py`):** 
   A comprehensive internal research PDF is parsed via `PyPDFLoader` and structurally divided into overlapping semantic segments using a `RecursiveCharacterTextSplitter`. These chunks are vectorized locally using `sentence-transformers` and committed to a SQLite-backed ChromaDB store.
2. **Contextual Retrieval (`rag_chain.py`):** 
   When a user submits a query through the React UI, the FastAPI backend intercepts it, vectorizes the raw text, and performs a similarity similarity search against the ChromaDB. The top 3 most relevant textual data chunks are extracted.
3. **Prompt Injection & Generation:** 
   The extracted text is injected rigidly into a system prompt. The prompt commands the Tencent HY3 LLM to only derive its answers from the injected text, effectively eliminating LLM hallucination and securing the business intelligence data pipeline.
4. **Cloud Execution:** 
   Deployed to Hugging Face Spaces using a Dockerized environment. A custom `startup.sh` script actively pulls the source PDF at server boot using API tokens, bypasses Hugging Face's restrictive Xet binary storage limits, dynamically generates the ChromaDB, and boots the FastAPI server on Port 7860 to serve the broader internet.

---

## 🚀 How to Run Locally

### 1. Start the AI Backend
```bash
# Navigate to the backend directory
cd american-dream-mall-rag

# Install dependencies
pip install -r requirements.txt

# Configure your environment secrets
# Ensure you have a .env file with OPENROUTER_API_KEY and HUGGINGFACE_API_KEY

# Ingest the PDF to build the Vector Database (One-time run)
python ingest.py

# Boot the FastAPI Server
uvicorn main:app --reload
```
*The backend will now listen on `http://localhost:8000`.*

### 2. Start the Frontend Application
```bash
# Open a new terminal in the root directory
# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
*The web interface will map locally, usually to `http://localhost:5173`. Clicking the chatbot button will instantly communicate with your running Python backend.*

---

## 🧠 AI Tools & Models Used

This project was built and accelerated using a suite of cutting-edge AI technologies and methodologies:

*   **Google Gemini Deep Research** → Comprehensive research report generation & detailed implementation planning
*   **Anthropic Claude Sonnet** → Detailed architectural analysis & logic bug fixes
*   **Google Anti-Gravity** → Direct AI-assisted software development and agentic codebase management
*   **GitHub Copilot** → Inline code assistance and semantic autocompletion
*   **HuggingFace `sentence-transformers`** → Open-source local text embeddings for the RAG pipeline
*   **OpenRouter Models** → Open-source Large Language Models powering the generation phase
