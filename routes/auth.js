const {Router} = require('express');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const router = Router();
 
router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError')
    })
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login#login')); //req.session.isAuth = false;
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({ email });
        if(candidate) {
            const isEq = await bcrypt.compare(password, candidate.password);
            if(isEq) {
                req.session.user = candidate;
                req.session.isAuth = true;
                req.session.save((err) => {
                    if(err) throw err
                    else res.redirect('/');
                });
            }
            else {
                req.flash('loginError', 'Неверный пароль');
                res.redirect('/auth/login#login');
            }
        }
        else {
            req.flash('loginError', 'Такого пользователя не существует ');
            res.redirect('/auth/login#login');
        }
    } catch(err) {
        console.log(err);
    }
    
});

router.post('/register', async (req, res) => {
    try {
        const {email, name,  password, confirm} = req.body;
        const candidate = await User.findOne({email});
        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register');
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            });
            await user.save();
            res.redirect('/auth/login#login');  
        }
        
    }
    catch(err) {
        console.log(err);
    }
})

module.exports = router;