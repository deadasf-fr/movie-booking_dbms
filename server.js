const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // For serving HTML/CSS files

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'moviedb'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

// User Registration
app.post('/register', (req, res) => {
    const { firstName, lastName, email, contactNo } = req.body;
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    const insertUserQuery = 'INSERT INTO users (first_name, last_name, email, contact_no) VALUES (?, ?, ?, ?)';

    db.query(checkUserQuery, [email], (err, result) => {
        if (result.length > 0) {
            return res.send('User already exists! Please login.');
        } else {
            db.query(insertUserQuery, [firstName, lastName, email, contactNo], (err) => {
                if (err) throw err;
                res.send('Registration successful! Please login.');
            });
        }
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email } = req.body;
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, result) => {
        if (result.length > 0) {
            res.send('Login successful!');
        } else {
            res.send('User not found! Please register.');
        }
    });
});

// Book Movie and Store in Billing Table
app.post('/book-movie', (req, res) => {
    const { email, movie, schedule, tickets, pricePerTicket } = req.body;

    // Calculate total amount
    const totalAmount = tickets * pricePerTicket;

    // Insert booking data into the billing table
    const insertBillingQuery = `
        INSERT INTO billing (email, movie, schedule, tickets, total_amount, booking_date)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;

    db.query(insertBillingQuery, [email, movie, schedule, tickets, totalAmount], (err) => {
        if (err) throw err;
        res.send('Movie booking and billing saved successfully!');
    });
});

// Listen on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
