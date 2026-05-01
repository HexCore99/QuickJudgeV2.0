from controllers.auth_controller import login, signup


def register_auth_routes(app):
    app.post("/api/auth/login")(login)
    app.post("/api/auth/signup")(signup)
