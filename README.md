# ApplyTrack. Frontend

ApplyTrack is a React single‑page app that helps you track job applications. It talks to a Django REST Framework API uses JWT authentication manages resources supports file uploads and shows data with charts.

**Live app:** https://applytrack-frontend.vercel.app

**Backend repo:** https://github.com/Nithingudditi/applytrack-backend

**API docs:** https://applytrack-backend-f4oy.onrender.com/api/docs/

---

## What this app does

- **Auth**. ApplyTrack lets you log in register on your own and try the demo with one click. JWT keeps you signed in. Automatically refreshes the token so you never get logged out.

- **Applications**. You can create applications see a list filter them by status or source and edit details. Each record stores company name, role, status, source, job URL, salary range and an optional resume.

- **Application detail**. The page shows status changes in a timeline lets you add, edit or remove contacts and interviews and link a resume.

- **Resumes**. You can upload resumes as files and view a list of earlier versions.

- **Insights**. The dashboard displays how responses you get and which sources work best shown in a chart.

- ** Routing**. ApplyTrack checks if you are logged in. If not it sends you to the login page before loading any protected content.

## Tech stack

Piece | Choice |

|---|---|

| Framework | React (Vite) |

| Routing | `react-router-dom` |

| HTTP client | `axios` with request/response interceptors for JWT handling |

| Charts | `recharts` |

| Deployment | Vercel

## Project structure

```

applytrack-frontend/

├── src/

│   ├── api/axios.js         . Axios instance configured with JWT request and response interceptors

│   ├── context/AuthContext.jsx. Shared authentication state (login, logout, isAuthenticated)

│   ├── components/

│   │   ├── ProtectedRoute.jsx. Redirects to /login if user not authenticated

│   │   └── Layout.jsx        . Layout with sidebar navigation

│   ├── utils/status.js       . List of status options and mapping to colors

│   └── pages/

│       ├── LoginPage.jsx

│       ├── RegisterPage.jsx

│       ├── DashboardPage.jsx

│       ├── ApplicationsPage.jsx

│       ├── ApplicationDetailPage.jsx

│       ├── ResumesPage.jsx

│       └── InsightsPage.jsx

├── App.jsx                   . Defines routes

└── main.jsx                  . Entry point that wraps App in BrowserRouter and AuthProvider

```

## Running locally

**Requirements:** You need Node.js, npm and the ApplyTrack backend running locally or on a server.

```bash

git clone https://github.com/your-username/applytrack-frontend.git

cd applytrack-frontend

npm install

cp.env.example.env

# edit.env. Set VITE_API_BASE_URL to your backends URL

npm run dev

```

App runs at `http://localhost:5173`.

## Environment variables

| Variable | Purpose |

|---|---|

VITE_API_BASE_URL` | Base URL of the backend API e.g. `Http://127.0.0.1:8000/api` locally or a live Render URL in production |

Vite only makes environment variables that start with `VITE_` available to client‑side code. This is a security measure.

## Demo account

```

username: demo

password: demo12345

```

Use the **"Try the demo"** button, on the login page.

## Deployment notes

ApplyTrack is deployed on Vercel. Vercel automatically detects the Vite build configuration. No custom setup is needed. The only step is to set `VITE_API_BASE_URL` in the Vercel dashboard. Because `.env` is git‑ignored it never reaches the deployed build otherwise.
