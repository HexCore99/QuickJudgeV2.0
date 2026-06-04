# QuickJudge V2.0

QuickJudge V2.0 is a full-stack online judge and coding contest platform. It uses a React frontend with an Express and MySQL backend to support authentication, contests, problems, submissions, discussions, leaderboards, profiles, and admin workflows.

## Tech Stack

- Frontend: Vite, React 19, Redux Toolkit, React Router DOM, Tailwind CSS v4
- Backend: Express 5, MySQL, JWT, bcrypt, Nodemailer
- Tooling: ESLint, Prettier

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm
- MySQL

## Installation

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Backend Environment

Create or update `backend/.env` with values like these:

```env
FRONTEND_URL=http://103.106.243.141:5173
PORT=5999
DB_HOST=127.0.0.1
DB_PORT=3325
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=qjV2
JWT_SECRET=change_this_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=example@gmail.com
SMTP_PASS=app_password_here
SMTP_FROM="example <example@gmail.com>"

JUDGE0_BASE_URL=https://ce.judge0.com
JUDGE0_AUTH_TOKEN=
JUDGE0_RAPIDAPI_KEY=
JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
```

Use your own local database password, JWT secret, and SMTP credentials. Leave the Judge0 auth values empty when using the public Judge0 CE endpoint, or fill them in if you use a private/RapidAPI Judge0 setup.

## Database Setup

Create the MySQL database and import the SQL file:

```text
Database/qjv2.sql
```

If password reset support is needed, also import:

```text
Database/password_reset_tokens.sql
```

## Running the App

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal from the project root:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5999`

## Available Scripts

From the project root:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

From `backend/`:

```bash
npm run dev
```

## Main Features

- Public landing, login, signup, forgot password, and reset password pages
- Student contest browsing, contest details, contest problems, submissions, queries, announcements, and leaderboard views
- Student profile, problem bank, discussions, notifications, and global leaderboard pages
- Admin dashboard, contest management, problem management, editorials, users, notifications, audit logs, and settings
- Backend APIs for authentication, contests, problems, submissions, profiles, leaderboards, discussions, drafts, and admin operations

## Notes

- The frontend Vite server proxies API requests to the backend on port `5999`.
- Keep pages inside `src/pages/` and reusable feature code inside `src/features/`.
- Keep new UI work responsive and consistent with the existing design system.
