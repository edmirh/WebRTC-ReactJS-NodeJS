const express = require('express');
const bcrypt = require('bcrypt')
const generator = require('generate-password');
const router = express.Router();
const User = require('../db/user');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function validateUser(user) {
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    const validPhone = typeof user.email == 'string' &&
                        user.email.trim() != ''
                        user.phone.trim().length >= 10;
    return validEmail && validPhone;
    
}

function validateUserLogin(user) {
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    return validEmail;
    
}

router.post('/signup', (req, res, next) => {
    if(validateUser(req.body)) {
        User.getOneByEmail(req.body.email).then((userEmail) => {
            if(!userEmail) {
                User.getOneByPhone(req.body.phone).then(user => {
                    console.log('user', user);
                    if(!user) {
                        const genPassword = generator.generate({
                            length: 6,
                            numbers: true,
                            uppercase: true,
                            symbols: false
                        });
                        bcrypt.hash(genPassword, 15)
                            .then((hash) => {
                                const user = {
                                    name: req.body.name,
                                    email: req.body.email,
                                    password: hash,
                                    phone: req.body.phone,
                                    date: new Date(),
                                    is_active: false
                                }
                                User.create(user)
                                .then(id => {
                                    res.json({
                                        message: 'Your account is created, check SMS for password!',
                                        success: true
                                    });
                                    //Send SMS to new user
                                    client.messages
                                    .create({
                                        body: '[VISUAL-SUPPORT] Your password is: ' + genPassword,
                                        from: process.env.TWILIO_PHONE_NUMBER,
                                        to: req.body.phone
                                    })
                                    .then(message => console.log('Message is sent!' ,message.sid)); 
                                }) 
                            });
                    }
                    else {
                        res.json({
                            message: 'Phone in use!',
                            success: false
                        })
                        next(new Error('Phone in use'));
                    }
                });
            }
            else {
                res.json({
                    message: 'Email in use!',
                    success: false
                })
                next(new Error('Email in use'));
            }
        });
    }
    else {
        next(new Error('Please fill up form correctly'));
    }
});

router.post('/login', (req, res, next) => {
    if(validateUserLogin(req.body)) {
        User.getOneByEmail(req.body.email)
        .then(user => {
            if(user) {
                bcrypt.compare(req.body.password, user.password).then(result => {
                    if(result) {
                        res.json({
                            success: true,
                            message: 'Successfuly logged in!'
                        });
                    }
                    else {
                        res.json({
                            success: false,
                            message: 'Invalid password!'
                        })
                        next(new Error('Invalid login! Please fill up form correctly'));
                    }
                });
            }
            else {
                next(new Error('User not exists!'));
            }
        });
    }
    else {
        next(new Error('Invalid login! Please fill up form correctly'));
    }
})

router.post('/users', (req, res, next) => {
    User.getOneByEmail(req.body.email)
    .then(user => {
        if(user) {
            const name = user.name
            res.json({
                name,
                success: true
            })
        }
        else {
            res.json({
                success: false,
                message: 'User do not exists'
            })
            next(new Error('Invalid login'));
        }
    })
})

module.exports = router;