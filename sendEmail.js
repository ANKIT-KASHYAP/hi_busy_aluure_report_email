const nodemailer = require("nodemailer");

// ✅ Static GitHub Pages Allure Report URL
const reportUrl = "https://ankit-kashyap.github.io/hi_busy_aluure_report_email/";

// ✅ Environment Variables (from GitHub Secrets)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO;

// ✅ Safety Check
if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
  console.error("Missing EMAIL_USER / EMAIL_PASS / EMAIL_TO in environment variables.");
  process.exit(1);
}

async function sendEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // ⚠ Change if not using Gmail
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: "Allure Automation Report",
      html: `
        <h2>Automation Execution Completed ✅</h2>
        <p>Please check the updated Allure Report below:</p>

        <a href="${reportUrl}"
           style="display:inline-block;
                  padding:10px 20px;
                  background-color:#0078D7;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:5px;
                  font-weight:bold;">
           View Allure Report
        </a>

        <br><br>
        Regards,<br>
        Ankit
      `,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Failed to send email:", err.message);
    process.exit(1);
  }
}

sendEmail();