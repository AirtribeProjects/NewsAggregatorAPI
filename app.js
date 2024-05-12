const express = require('express');
const app = express();
const port = 3000;
const Validator = require('./Helpers/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = require('./Middleware/authJWT');
const fetchNewsFromAPI = require('./Helpers/newsService');
const { readUsersFromFile, writeUsersToFile } = require('./Helpers/utils');

app.use(express.json());

app.listen(port, (err) => {
    if (err) {
        console.log("Somthing bad happened", err);
    } else {
        console.log("server is started");
    }
});

const userData = './users.json';

/**
 * Registers a new user with the provided username, email, and password.
 */
app.post('/register', async (req, res) => {
    try {
        let users = [];
        const userDetails = req.body;
        if (Validator.validateUserDetails(userDetails).status == true) {
            // Read user data from users.json file
            users = await readUsersFromFile(userData);
            // Check if the username or email id already exists
            if (users.some(user => (user.userName === userDetails.userName || user.emailId === userDetails.emailId))) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(userDetails.password, 10);
            // Store the user information
            users.push({ userName: userDetails.userName, emailID: userDetails.emailId, password: hashedPassword, preferences: userDetails.preferences });
            // Write updated user data to users.json file
            await writeUsersToFile(userData, users);
            res.json({ message: 'User registered successfully' });
        } else {
            let message = Validator.validateUserDetails(userDetails).message;
            return res.status(400).send(message);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

/*
Logs in user with the provided correct username and password.
*/
app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (Validator.validateLoginDetails(req.body).status == true) {
            // Read user data from users.json file
            const users = await readUsersFromFile(userData);
            const user = users.find(user => user.userName === userName);
            //check if the user is present
            if (!user) {
                return res.status(401).json({ error: 'Invalid username' });
            }
            // Compare the hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'please check the password' });
            }
            // Generate JWT token
            const token = jwt.sign({ userName }, process.env.SECRET_KEY, { expiresIn: 86400 });
            res.json({ token, message: "Login sucess" });
        } else {
            let message = Validator.validateLoginDetails(req.body).message;
            return res.status(400).send(message);
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in user' });
    }
});
/*
Retrieve news preferences for the logged-in user
*/
app.get('/preferences', verifyToken, async (req, res) => {
    try {
        const { userName } = req.user;
        // Read user data from users.json file
        const users = await readUsersFromFile(userData);
        const user = users.find(user => user.userName === userName);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        res.json({ preferences: user.preferences });
    } catch (error) {
        console.error('Error retrieving preferences:', error);
        res.status(500).json({ error: 'Failed to retrieve preferences' });
    }
});
/*
Update the news preferences for the logged-in user.
*/
app.put('/preferences', verifyToken, async (req, res) => {
    try {
        const { userName } = req.user;
        const validatePreferencesInput = Validator.validatePreferencesInput(req.body);
        if (validatePreferencesInput) {
            return res.status(400).send(validatePreferencesInput);
        }
        const users = await readUsersFromFile(userData);
        const userIndex = users.findIndex(user => user.userName === userName);
        if (userIndex === -1) {
            return res.status(404).json({ error: "User not found" });
        }
        //users[userIndex].preferences = req.body.preferences;
        users[userIndex].preferences.push(...req.body.preferences);

        // Write updated users back to file
        await writeUsersToFile(userData, users);
        res.json({ message: "Preferences updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/*
 fetch news based on the logged-in user's preferences
*/
app.get('/news', verifyToken, async (req, res) => {
    try {
        const userDetails = req.user;
        const users = await readUsersFromFile(userData);
        const user = users.find(user => user.userName == userDetails.userName);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const news = await fetchNewsFromAPI(user.preferences);
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

module.exports = app;