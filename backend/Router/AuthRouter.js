const { signup } = require('../Controllers/AuthController');
const { signupValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', (req,res)=>{
    res.send('Login Success');
})

router.post('/signup', signupValidation, signup);

module.exports = router;