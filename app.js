if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
// REQUIRING
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const Event = require('./models/eventsDB');
const events = require('./seeds/eventsSeeds');
const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/usersDB')
const Schema = mongoose.Schema;
const eventRoutes = require('./routes/events');
const commentRoutes = require('./routes/comments');
const usersRoutes= require('./routes/users')
const ObjectId = Schema.ObjectId;





// PLAN 
// 1. SERVER IMG UPLOADS WITH Cloudinary
// 2. ADDING A MAP WITH MAPBOX
// 3. ADDING CLUSTER MAP






// MIDDLEWARES
const app = express();
app.engine('ejs', engine);
app.set('views', path.join(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/the-controversies');

const sessionConfig = {
    secret: 'stuff',
    resave: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.redirectUrl= req.session.returnTo;
    res.locals.currentUser= req.user;
    next();
})






// ROUTES

app.use('/events', eventRoutes);
app.use('/', commentRoutes);
app.use('/', usersRoutes)



// TO RENEW THE DB
app.get('/renew', async (req, res) => {
    await Event.deleteMany({});
    for (let i = 0; i < events.length; i++) {
        const event = new Event({
            title: `${events[i].title}`,
            description: `${events[i].description}`,
            content: `${events[i].content}`
        });
        await event.save();
    };
    const news = await Event.find({});
    res.send(news)
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('events/error', { err })
});


app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})