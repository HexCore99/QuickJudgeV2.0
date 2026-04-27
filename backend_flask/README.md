# QuickJudge Flask Backend

This is a Flask version of the existing Express backend. The original `backend/`
folder is unchanged.

## Setup

```bash
cd backend_flask
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

By default this backend loads environment variables from `../backend/.env`.
You can also create `backend_flask/.env` to override those values for Flask only.

## Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/contests`
- `GET /api/contests/<contest_id>`
- `POST /api/contests/<contest_id>/register`
- `POST /api/contests/<contest_id>/verify-password`
