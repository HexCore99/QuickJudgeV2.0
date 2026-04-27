from flask import jsonify


def success_response(status_code, message, data=None):
    body = {
        "success": True,
        "message": message,
    }

    if data:
        body.update(data)

    return jsonify(body), status_code


def error_response(status_code, message):
    return jsonify(
        {
            "success": False,
            "message": message,
        },
    ), status_code
