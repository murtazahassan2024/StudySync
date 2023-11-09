// emailService.js
import nodemailer from 'nodemailer';

const sendEmail = async (emailOptions) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email service
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your password
    },
  });

  try {
    console.log(emailOptions)
    let info = await transporter.sendMail(emailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;

// Example usage:
// Send a test email to check functionality
const testEmailOptions = {
  from: '"Test User" <study.sync.depauw@gmail.com>', // sender address
  to: "murtazahassan_2024@depauw.edu", // list of receivers
  subject: "Hello ✔", // Subject line
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>", // html body
};

sendEmail(testEmailOptions)
  .then(sent => console.log('Sent?', console.log("djd")))
  .catch(err => console.error(err));
