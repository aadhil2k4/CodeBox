const router = require('express').Router();

router.post('/login', (req,res)=>{
    res.send('Login Success');
})

router.post('/signup', (req,res)=>{
    res.send('SignUp Success');
})

module.exports = router;