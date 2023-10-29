import nodemailer from "nodemailer";

async function sendEmailService({
  to,
  subject,
  message,
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: "abdoosama087@gmail.com",
      pass: "vkaupmlummizequr",
    },
  });
  const emailInfo = await transporter.sendMail({
    from: "'SarahaApp' <abdoosama087@gmail.com>",
    to: to ? to : "",
    subject: subject ? subject : "hello",
    html: message ? message : "",
    attachments,
  });
  console.log(emailInfo);
  if (emailInfo.accepted.length) {
    return true
  } else {
    return false
  }
}

export default sendEmailService