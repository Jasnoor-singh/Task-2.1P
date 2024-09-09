require('dotenv').config();
const express = require('express');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const path = require('path');
const app = express();

// Mailgun configuration
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY, // Ensure your Mailgun API key is set in the .env file
});

// Middleware to serve static files
app.use(express.static('public')); // Serves CSS, images, and JS
app.use(express.json()); // Parses JSON requests

// Route to serve signup.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// POST route to handle the signup form submission
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    const messageData = {
        from: 'Dev@Deakin <no-reply@yourdomain.com>', // Replace with your domain or sandbox domain
        to: email,
        subject: 'Welcome to Dev@Deakin',
        text: 'Thank you for subscribing to Dev@Deakin. We are excited to have you on board!',
    };

    // Sending email using Mailgun
    mg.messages.create('sandboxa00c8e40678c44529c17b6df55a50964.mailgun.org', messageData)
        .then(response => {
            res.status(200).send('Welcome email sent successfully!');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error sending email');
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
