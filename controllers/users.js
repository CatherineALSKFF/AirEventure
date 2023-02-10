const User = require('../models/usersDB')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

module.exports.renderRegisterForm=(req, res) => {
    res.render('users/register')
};

module.exports.createUser= async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/events');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
};

module.exports.renderLoginForm= (req, res) => {
    res.render('users/login')
};

module.exports.loginUser= (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.redirectUrl || '/events';
    res.redirect(redirectUrl)
};

module.exports.logout=  (req, res) => {
    req.logout((err) => {
        if (err) { return nextTick(err) } else {
            req.flash('success', 'Goodbye')
            res.redirect("/events");
        }
    });
};