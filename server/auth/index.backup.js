const express = require('express');
const bcrypt = require('bcrypt')
const generator = require('generate-password');
const router = express.Router();
const User = require('../db/user');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function validateUser(req, res, next) {
    const user = req.body;
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    const validPhone = typeof user.email == 'string' &&
                        user.email.trim() != ''
                        user.phone.trim().length >= 10;
    if(validEmail && validPhone) {
        next();
    }
    else {
        next(new Error('Please fill up form correctly'));
    }    
}

function validateUserLogin(req, res, next) {
    const user = req.body;
    const validEmail = typeof user.email == 'string' && user.email.trim() != '';
    if(validEmail) {
        next();
    }
    else {
        next(new Error('Invalid login! Please fill up form correctly'));
    }
}


router.post('/signup', validateUser, async (req, res, next) => {
    const { email, phone } = req.body
    const userEmail = await User.getOneByEmail(email)
        if(!userEmail) {
            const user = await User.getOneByPhone(phone)
            if(!user) {
                const genPassword = generator.generate({
                    length: 6,
                    numbers: true,
                    uppercase: true,
                    symbols: false
                });
                const hash = await bcrypt.hash(genPassword, 15)
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        phone: req.body.phone,
                        date: new Date(),
                        is_active: false
                    }
                    await User.create(user)
                    res.json({
                        message: 'Your account is created, check SMS for password!',
                        success: true
                    });
                    //Send SMS to new user
                    const message = await client.messages
                    .create({
                        body: '[VISUAL-SUPPORT] Your password is: ' + genPassword,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: req.body.phone
                    })
                    console.log('Message is sent!', message.sid); 
            }
            else {
                res.json({
                    message: 'Phone in use!',
                    success: false
                })
                next(new Error('Phone in use'));
            }
    }
    else {
        res.json({
            message: 'Email in use!',
            success: false
        })
        next(new Error('Email in use'));
    }
})

router.post('/login', validateUserLogin, async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.getOneByEmail(email)
    if(user) {
        const result = await bcrypt.compare(password, user.password)
        if(result) {
            res.json({
                success: true,
                message: 'Successfully logged in!'
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid password!'
            });
            next(new Error('Invalid login! Please fill up form correctly'));
        }
    } else {
        next(new Error('User not exists!'));
    }
})

router.post('/users', (req, res, next) => {
    const { email } = req.body
    User.getOneByEmail(email)
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
                message: 'User do not exist'
            })
            next(new Error('Invalid login'));
        }
    })
})

module.exports = router;