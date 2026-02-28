const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const repo = process.env.GITHUB_REPOSITORY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Missing EMAIL_USER or EMAIL_PASS.\n- For local runs: create a .env file with EMAIL_USER and EMAIL_PASS.\n- For CI: set repository secrets and ensure they are passed into the job as env vars.');
  process.exit(1);
}
const reportUrl = `https://${repo.split("/")[0]}.github.io/${repo.split("/")[1]}/`;

async function sendEmail() {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Automation Test Execution Report",
    html: `
      <h2>Automation Execution Completed ✅</h2>
      <p>Please check the Allure Report below:</p>
      <a href="${reportUrl}">${reportUrl}</a>
    `,
  });

  console.log("Email sent successfully!");
}

try {
  sendEmail();
} catch (err) {
  console.error('Failed to send email:', err && err.message ? err.message : err);
  process.exit(1);
}