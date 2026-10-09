# AvenWeg – AI Career & Placement Assistant

**Find Your Path. Build Your Future.**

AvenWeg is a full-stack career and placement assistance platform designed to help students and job seekers prepare for their careers. It brings together resume analysis, job search, application tracking, interview preparation, and career guidance in one application.

## 🚀 Features

- **AI Career Assistant:** Get career-related guidance and answers to career questions.
- **Resume Analysis:** Upload a resume and receive analysis to help improve it.
- **Job Listings:** Explore job opportunities and search for suitable roles.
- **Job Application Tracking:** Keep track of job applications and their progress.
- **Career Preparation:** Access career and placement preparation resources.
- **Mock Interviews:** Practice interview questions and improve interview readiness.
- **User Authentication:** Register and log in to access the platform.
- **Profile Management:** Manage your career profile and personal information.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML and CSS
- Axios
- React Router

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT authentication
- bcrypt

### Database
- PostgreSQL

### AI Integration
- Ollama
- Llama 3.2
- Career knowledge-base fallback when Ollama is unavailable

## 📁 Project Structure

```text
AvenWeg/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   ├── ai_assistant.py
│   ├── resume_analyzer.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── api.js
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

*Note: This is an illustrative structure. Adjust the filenames to match your actual project.*

## ⚙️ Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- PostgreSQL
- Ollama (optional, for local AI responses)

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/divyabaditha414-oss/AvenWeg.git
cd AvenWeg
```

### 2. Set Up the Backend

Open a terminal in the project root:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a local `.env` file inside the `backend` directory. Configure your PostgreSQL connection string and a strong, private secret key. **Never commit this file to GitHub.**

Example configuration:

```env
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE
SECRET_KEY=YOUR_PRIVATE_RANDOM_SECRET
```

Make sure PostgreSQL is running and the configured database exists.

Start the backend:

```bash
uvicorn main:app --reload
```

The backend API will normally be available at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

### 4. Optional: Configure Ollama

Install Ollama and download the Llama 3.2 model:

```bash
ollama pull llama3.2
```

Start Ollama and use the AI Assistant in AvenWeg. If Ollama is unavailable, the application may use its configured career knowledge base.

## 🔐 Security

- Keep `.env` files out of version control.
- Never publish database passwords, JWT secrets, or API keys.
- Use strong secrets and appropriate production environment variables.
- Configure CORS and authentication appropriately before deployment.

## 🎯 Project Objective

The objective of AvenWeg is to provide students and job seekers with a unified platform for career guidance, resume improvement, job application management, and interview preparation.

## 👩‍💻 Author

**Divya Baditha**

## 📄 License

No license has been specified yet. Add a license if you intend to permit others to reuse or distribute the project.
