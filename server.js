const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Read contents of emails.txt
const readEmails = () => {
  try {
    const content = fs.readFileSync('emails.txt', 'utf8');
    return content;
  } catch (error) {
    throw error;
  }
};

// Setup Express route
app.get('/emails', (req, res) => {
  const emailContent = readEmails();
  res.send(`<html><body><pre>${emailContent}</pre><button onclick="sendEmail()">Send Email</button><div id="notification"></div><script>
    function sendEmail() {
      fetch('/send-email')
        .then(response => response.json())
        .then(data => {
          document.getElementById('notification').innerText = data.message;
        })
        .catch(error => {
          console.error('Error sending email:', error.message);
          document.getElementById('notification').innerText = 'Error sending email.';
        });
    }
  </script></body></html>`);
});

// Setup Express route to handle sending email
app.get('/send-email', (req, res) => {
  const emailContent = readEmails();

  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'email', // Add your Gmail address
      pass: 'pass', // Add your Gmail password or use an app-specific password
    },
  });

  const mailOptions = {
    from: 'faiahmad010@gmail.com',
    to: 'faiahmad010@gmail.com', // Add the recipient's email address
    subject: 'Read data from the Text file',
    text: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent successfully.' });
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/emails`);
});