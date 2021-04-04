const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth')
const router = Router();

function mapCartItems(cart) {
    return cart.items.map(i => ({
        ...i.courseId._doc,
        id: i.courseId.id,
        count: i.count
    }));
}

function computeCost(courses) {
    return courses.reduce((acc, course) => { return acc + course.count * course.cost }, 0)
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses  = mapCartItems(user.cart);
    const cart = {
        courses, cost: computeCost(courses)
    }
    res.json(cart);
})

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = mapCartItems(user.cart);
    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        cost: computeCost(courses)
    })
})



module.exports = router;