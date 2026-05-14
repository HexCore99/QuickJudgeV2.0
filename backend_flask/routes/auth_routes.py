from controllers.auth_controller import (
    forgot_password,
    login,
    reset_password,
    signup,
)


def register_auth_routes(app):
    app.post("/api/auth/login")(login)
    app.post("/api/auth/signup")(signup)
    app.post("/api/auth/forgot-password")(forgot_password)
    app.post("/api/auth/reset-password")(reset_password)
