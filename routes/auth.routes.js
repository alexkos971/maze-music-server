const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
// import Email from 'email-templates';
const User = require('../models/User');
let cors = require('cors')

// Register
router.post('/register', 
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 8 символов').isLength({min: 8})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array, message: 'Некорректные данные при регистрации' });

        const {name, email, password } = req.body;

        const candidate = await User.findOne({ email });
        if (candidate) {
            return res.status(400).json({ message: 'Такой пользователь уже существует' });
        }

        if (!name.length) {
            return res.status(400).json({ message: "Укажите имя" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, name });
        
        await user.save();

        res.status(201).json({ name, email, message: 'Пользователь создан' });
    }
    catch (e) {
        res.status(500).json({ message: `Что-то пошло не так...${e}` });
    }
});

// Login
router.post('/login', cors(),
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Пароль неверный').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Некорректные данные при регистрации',
                errors: errors.array() 
            });
        }
        
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден...' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }
        
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtKey'),
            {});
        
        res.status(200).json({ email, token, userId: user.id })
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// Recovery
router.post('/checkEmail', async (req, res) => {
    try {
        const { email } = req.body;

        const check = await User.findOne({ email })
        if (check) {
            res.status(200).json({ message: req.body })

        }
        res.status(404).json({ message: 'Пользователь не найден' })
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router;