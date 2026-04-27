import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

load_dotenv(PROJECT_ROOT / "backend" / ".env")
load_dotenv(BASE_DIR / ".env", override=True)

from config.db import check_database_connection  # noqa: E402
from routes.auth_routes import auth_bp  # noqa: E402
from routes.contest_routes import contest_bp  # noqa: E402


def create_app():
    app = Flask(__name__)

    frontend_url = os.getenv("FRONTEND_URL")
    CORS(
        app,
        origins=[frontend_url] if frontend_url else "*",
        supports_credentials=True,
    )

    @app.get("/")
    def home():
        return {
            "success": True,
            "message": "QuickJudge backend is running",
        }

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(contest_bp, url_prefix="/api/contests")

    return app


app = create_app()


if __name__ == "__main__":
    try:
        check_database_connection()
        port = int(os.getenv("PORT", "5000"))
        host = os.getenv("HOST", "127.0.0.1")
        debug = os.getenv("FLASK_DEBUG") == "1"

        print(f"Server running on http://localhost:{port}")
        app.run(host=host, port=port, debug=debug)
    except Exception as error:
        app.logger.exception("Failed to start server")
