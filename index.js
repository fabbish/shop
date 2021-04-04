const express = require("express");
const session = require("express-session");
const csurf = require('csurf');
const flash = require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require("mongoose");
const path = require("path");
const handleBars = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const Handlebars = require('handlebars');
const User = require('./models/users');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const keys = require('./keys/index');


const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express();

const hbs = handleBars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('60604ad8633ec638948c8093');
//         req.user = user;
//         next();
//     }
//     catch(e) {
//         console.log(e);
//     }
// })

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(csurf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes); 
app.use('/order', ordersRoutes);
app.use('/auth', authRoutes);

const port = process.env.port || 3000;

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        // const candidate = await User.findOne();
        // if(!candidate) {
        //     const user = new User({
        //         email: 'fabbish@gmail.com',
        //         name: 'fabbish',
        //         cart: {items: []}
        //     });
        //     await user.save();
        // }

        app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
    }
    catch(err) {
        console.log(err);
    }
    
}

start();

