# 📞 Monochrome Twilio Web Calling Platform

A sleek, high-contrast Black & White Web Calling Application powered by **Node.js, Express, React (Vite)**, and **Twilio Voice SDK (WebRTC)**. Allows users to register, dial international phone numbers, and conduct live 2-way audio calls directly through their web browser with concurrent multi-user calling support.

---

## 🌟 Key Features

* **Direct 1-on-1 WebRTC Voice Calling**: Crystal-clear 2-way microphone and speaker audio directly connecting the browser to any real phone number worldwide.
* **Concurrent Multi-User Calling**: Multiple users can register and place live calls to different clients simultaneously from a single master Twilio phone number.
* **Smart Keypad Dialer**: Full DTMF audio tones synthesizer with a global country code selector (65+ countries with flags).
* **Live Active Call Overlay**: Real-time connected status badge, ticking duration clock, animated audio waveform visualizer, mute/unmute microphone toggle, and one-click disconnect.
* **Call History Logs**: Automatic tracking of call duration, recipient number, timestamp, and redial action.
* **Admin Control Panel**:
  * View and delete registered user accounts.
  * Audit all system-wide call details across all users.
  * Dynamically update Twilio API credentials without server restarts.
* **Monochrome UI & Responsive Design**: High-contrast Black & White theme with an instant **Dark / Light Mode** switcher, fully optimized for Desktop, Tablet, and Mobile screens.
* **Dockerized & Production-Ready**: Ready for local containerized development and 1-click cloud deployment.

---

## 🏗️ Tech Stack

* **Backend**: Node.js (ES Modules), Express.js, Twilio Node SDK, JSON Web Tokens (JWT), bcryptjs, cors, dotenv.
* **Frontend**: React 19, Vite, `@twilio/voice-sdk` (WebRTC), Lucide React Icons, Pure Custom CSS Design System.
* **Database**: Lightweight persistent JSON file store (`data/db.json`).
* **Containerization**: Docker & Docker Compose.

---

## 📋 Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher) & `npm`
* [Docker](https://www.docker.com/) (Optional, for containerized execution)
* A [Twilio Account](https://www.twilio.com/) (Upgraded with balance for live calling)

---

## ⚙️ Twilio Configuration Setup

To enable WebRTC direct browser calling, you will need 5 values from your [Twilio Console](https://console.twilio.com/):

| Environment Variable | Where to find it in Twilio Console | Description |
| :--- | :--- | :--- |
| `TWILIO_ACCOUNT_SID` | **Account Dashboard** | Account Identifier (starts with `AC...`) |
| `TWILIO_AUTH_TOKEN` | **Account Dashboard** | Master Auth Token |
| `TWILIO_PHONE_NUMBER` | **Phone Numbers ➔ Active numbers** | Your purchased Twilio phone number (e.g. `+19856022321`) |
| `TWILIO_API_KEY` | **Account ➔ API Keys** | Standard API Key SID (starts with `SK...`) |
| `TWILIO_API_SECRET` | **Account ➔ API Keys** | Secret generated during API Key creation |
| `TWILIO_TWIML_APP_SID`| **Develop ➔ Voice ➔ TwiML Apps** | TwiML Application SID (starts with `AP...`) |

### Setting up the TwiML App:
1. Go to **Develop** ➔ **Voice** ➔ **Manage** ➔ **TwiML Apps** ➔ Click **Create new TwiML App**.
2. Set **Friendly Name** to `MonochromeVoiceApp`.
3. Under **Voice ➔ Request URL**, set the URL to your public server endpoint (using **HTTP POST**):
   * For Local Development with ngrok: `https://<your-ngrok-subdomain>.ngrok-free.app/api/twilio/voice`
   * For Production: `https://<your-deployed-domain>.com/api/twilio/voice`
4. Click **Save** and copy the **Application SID** (`AP...`).

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository & install dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd Twilio_integrated

# Install backend dependencies
npm install

# Install frontend dependencies
npm run client:install
```

### 2. Configure Environment Variables
Copy the sample environment file and add your credentials:
```bash
cp .env.example .env
```
Open `.env` and fill in your Twilio keys.

### 3. Build & Run
```bash
# Build the React frontend production bundle
npm run client:build

# Start the fullstack server
npm start
```
Open **`http://localhost:5050`** in your browser.

---

## 🐳 Running with Docker

You can spin up the entire application inside Docker with a single command:

```bash
# Build and start container
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Stop container
docker compose down
```

The application will be live at **`http://localhost:5050`**.

---

## 🔐 Default Admin Account

The system comes pre-seeded with a master Administrator account:

* **Email**: `admin@example.com`
* **Password**: `pakistan123`

*(Regular users can register new accounts directly from the public registration form without a phone number).*

---

## 🌐 Deploying to Production (Render / Railway / VPS)

1. Push your repository to **GitHub**.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Connect your GitHub repository:
   * **Build Command**: `npm install && npm run client:install && npm run client:build`
   * **Start Command**: `npm start`
   * **Environment Variables**: Add all variables from your `.env` file (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_API_KEY`, `TWILIO_API_SECRET`, `TWILIO_TWIML_APP_SID`, `JWT_SECRET`, `PORT=5050`).
4. **Update Twilio TwiML App URL**:
   * Once your service is deployed and assigned a live HTTPS domain (e.g. `https://my-app.onrender.com`), go back to **Twilio Console ➔ TwiML Apps** and update the **Voice Request URL** to:
     ```text
     https://my-app.onrender.com/api/twilio/voice
     ```
5. Your web application is now globally accessible and ready for multi-user concurrent calling!

---

## 📁 Project Structure

```text
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # UI Components (Navbar, Dialer, ActiveCall, CallLogs, AdminDashboard, Auth)
│   │   ├── services/           # Twilio Voice SDK WebRTC Service (voice.js)
│   │   ├── App.jsx             # Main Application Logic
│   │   ├── index.css           # Monochrome Theme CSS System
│   │   └── main.jsx            # React Root Entrypoint
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── db.js                   # JSON File-based Database Handler
│   └── db.json                 # Persistent Storage (Users, Call Logs, Twilio Config)
├── routes/
│   ├── auth.js                 # Authentication & User Management API Endpoints
│   └── twilio.js               # Twilio WebRTC Token, TwiML Voice & Call API Endpoints
├── .env.example                # Template for Environment Variables
├── .gitignore                  # Git Ignored Files & Folders
├── Dockerfile                  # Multi-stage Docker Build File
├── docker-compose.yml          # Docker Compose Orchestration File
├── package.json                # Server Dependencies & Scripts
├── server.js                   # Express Server Entrypoint
└── README.md                   # Project Documentation
```

---

## 📄 License

MIT License. Feel free to use and customize for your own projects!
