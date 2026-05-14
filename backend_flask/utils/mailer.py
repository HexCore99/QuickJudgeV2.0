import os
import smtplib
from email.message import EmailMessage
from html import escape


def get_smtp_port():
    try:
        return int(os.getenv("SMTP_PORT", "587"))
    except ValueError:
        return 587


def send_password_reset_email(to, reset_link):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_port = get_smtp_port()
    sender = os.getenv("SMTP_FROM") or smtp_user

    if not smtp_host or not smtp_user or not smtp_pass:
        raise RuntimeError("SMTP configuration is incomplete")

    message = EmailMessage()
    message["From"] = sender
    message["To"] = to
    message["Subject"] = "Reset your QuickJudge password"
    message.set_content(
        "\n".join(
            [
                "Reset your QuickJudge password",
                "",
                "Use the link below to reset your password. "
                "This link expires in 15 minutes.",
                reset_link,
                "",
                "If you did not request this, you can ignore this email.",
            ],
        ),
    )
    message.add_alternative(
        f"""
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin: 0 0 12px;">Reset your QuickJudge password</h2>
          <p>Use the button below to reset your password. This link expires in 15 minutes.</p>
          <p style="margin: 24px 0;">
            <a
              href="{escape(reset_link)}"
              style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 700;"
            >
              Reset password
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p><a href="{escape(reset_link)}" style="color: #2563eb;">{escape(reset_link)}</a></p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
        """,
        subtype="html",
    )

    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as smtp:
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(message)
        return

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_pass)
        smtp.send_message(message)
