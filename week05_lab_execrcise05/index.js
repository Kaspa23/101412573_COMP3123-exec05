const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// Use body-parser middleware
app.use(bodyParser.json());

// Serve the home.html file
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Return all details from user.json file
router.get('/profile', (req, res) => {
    const user = JSON.parse(fs.readFileSync('user.json', 'utf-8'));
    res.json(user);
});

// Modify /login route to accept username and password as JSON body parameter
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = JSON.parse(fs.readFileSync('user.json', 'utf-8'));

    if (username === user.username) {
        if (password === user.password) {
            res.json({
                status: true,
                message: 'User is valid',
            });
        } else {
            res.json({
                status: false,
                message: 'Password is invalid',
            });
        }
    } else {
        res.json({
            status: false,
            message: 'Username is invalid',
        });
    }
});

// Modify /logout route to accept username as parameter
router.get('/logout', (req, res) => {
    const username = req.query.username;
    res.send(`<b>${username} successfully logged out.</b>`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.port || 5000, () => {
    console.log('Web Server is listening at port ' + (process.env.port || 5000));
});
