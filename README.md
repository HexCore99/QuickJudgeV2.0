# QuickJudge V2.0

QuickJudge V2.0 is a full-stack online judge and coding contest platform. It lets users solve programming problems, submit code, and manage contest workflows through a React/Vite frontend powered by a Flask and MySQL backend.

## Prerequisites

- Node.js and npm
- Python 3
- MySQL, such as through XAMPP

## Backend Environment

The current backend environment file is [backend_flask/.env](E:/ProG/QuickJudge/QuickJudgeV2.0/backend_flask/.env):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=""
DB_NAME=quickjudge
JWT_SECRET=change_this_secret
FRONTEND_URL=http://localhost:5180
```

## Database Setup

Open XAMPP, start MySQL, then go to phpMyAdmin and import:

```text
Database/quickjudgeV2.sql
```

## Run the Backend

```txt
Open XAMPP, start MySQL, then go to phpMyAdmin and import:
```

Open a terminal from the project root:

```bash
cd backend_flask
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend runs at:

```text
http://localhost:5000
```

## Run the Frontend

Open another terminal from the project root:

```bash
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5180
```
