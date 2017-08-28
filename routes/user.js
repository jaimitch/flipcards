const express = require('express');
const router = express.Router();
const data = require('../data.json');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('file-system');

router.get('/', (request, response) => {
    return response.render('login');
});

router.get('/api/signup', (request, response) => {
    var model = {
        message: "Create your your account here!"
    }
    return response.render('signup', model);
});

router.post('/api/signup', (request, response) => {
    var user = data.users.find(user => { return user.email === request.body.email });
    if (user) {
        var model = {
            message: "That email is already registered. Please choose another email address to create a new account or log in to current account to continue."
        }
        return response.render('login', model);
    }
    else if (request.body.email && request.body.password) {
        var hashed = crypto.pbkdf2Sync(request.body.password, 'salt', 10, 512, 'sha512').toString('base64');
        var user = {
            email: request.body.email,
            password: hashed,
        }
        data.users.push(user);
        request.session.isAuthenticated = true;
        var model = {
        }
        var itemsJSON = JSON.stringify(data);
        fs.writeFileSync('data.json', itemsJSON);
        if (data.decks[0] != undefined) {
            var modelStatus = {
                message: "success",
                data: data.decks
            }
            return response.render('dashboard', modelStatus);
        } else {
            return response.status(400).json({ message: "Route Failed" });
        }
    } else {
        return response.status(400).json({ message: "All fields MUST be filled in." });
    }
});

router.post('/api/login', (request, response) => {
    var hashed = crypto.pbkdf2Sync(request.body.password, 'salt', 10, 512, 'sha512').toString('base64');
    var userEmail = data.users.find(user => { return user.email === request.body.email });
    var userPW = data.users.find(user => { return user.password === hashed });
    if (userEmail && userPW) {
        request.session.isAuthenticated = true;
        return response.redirect('/api/decks');
    } else if (userEmail) {
        return response.status(400).json({ message: "Incorrect password" });
    }
    else {
        return response.redirect('/api/signup');
    }
});

router.post('/api/logout', (request, response) => {
    request.session.destroy();
    var model = {
        message: "you have been successfully logged out! We suggest closing the window for security purposes."
    }
    response.render('login', model);
});

module.exports = router;