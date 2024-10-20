const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./Router/AuthRouter');

const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send('Hi');
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
