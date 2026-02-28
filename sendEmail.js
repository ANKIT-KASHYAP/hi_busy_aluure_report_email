const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const repo = process.env.GITHUB_REPOSITORY;
const reportUrl = `https://${repo.split("/")[0]}.github.io/${repo.split("/")[1]}/`;

async function sendEmail() {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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

sendEmail();