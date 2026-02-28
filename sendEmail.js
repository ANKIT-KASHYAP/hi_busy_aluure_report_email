const nodemailer = require("nodemailer");

// 📍 Determine report URL
// if a REPORT_URL env var is provided it takes precedence, otherwise
// construct one from the repo name (owner/repo) using GitHub Pages pattern.
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO;

let reportUrl = process.env.REPORT_URL;
if (!reportUrl) {
  const repo = process.env.GITHUB_REPOSITORY || '';
  if (repo) {
    const [owner, name] = repo.split('/');
    reportUrl = `https://${owner}.github.io/${name}/`;
  }
}

// if we still don't have a URL, warn – the sending will continue but link
// may be undefined.
if (!reportUrl) {
  console.warn('REPORT_URL could not be determined; check GITHUB_REPOSITORY or set REPORT_URL.');
}

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