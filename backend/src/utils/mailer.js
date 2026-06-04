import nodemailer from "nodemailer";

function getSmtpPort() {
  const port = Number(process.env.SMTP_PORT || 587);
  return Number.isNaN(port) ? 587 : port;
}

function createTransporter() {
  const smtpPort = getSmtpPort();

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export default async function sendPasswordResetEmail(to, resetLink) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from,
    to,
    subject: "Reset your QuickJudge password",
    text: [
      "Reset your QuickJudge password",
      "",
      "Use the link below to reset your password. This link expires in 15 minutes.",
      resetLink,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">Reset your QuickJudge password</h2>
        <p>Use the button below to reset your password. This link expires in 15 minutes.</p>
        <p style="margin: 24px 0;">
          <a
            href="${resetLink}"
            style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 700;"
          >
            Reset password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>
          <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
        </p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}
