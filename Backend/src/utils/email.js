const nodemailer = require("nodemailer");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error(
    "EMAIL_USER and EMAIL_PASS must be set in your .env file"
  );
}

/**
 * Sends a verification email to a new user
 * @param {Object} user - The user object {name, email}
 * @param {string} token - The verification token
 */
const sendVerificationEmail = async (user, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your preferred SMTP provider
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; font-size: 24px; text-align: center; }
        p { color: #555; font-size: 16px; line-height: 1.5; }
        a.button { display: inline-block; padding: 14px 28px; background-color: #0070f3; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome, ${user.name}!</h1>
        <p>Thank you for creating an account on <strong>Quiz App</strong>. To get started, please verify your email by clicking the button below:</p>
        <p style="text-align:center;">
          <a href="${verifyUrl}" class="button">Verify Email</a>
        </p>
        <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}" style="color:#0070f3;">${verifyUrl}</a></p>
        <div class="footer">© ${new Date().getFullYear()} Quiz App. All rights reserved.</div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"Quiz App" <${EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email Address",
      html,
    });

    console.log(`Verification email sent to ${user.email}`);
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Failed to send verification email");
  }
};

module.exports = { sendVerificationEmail };
