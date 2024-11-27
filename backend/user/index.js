const express= require('express')

const app = express();

app.get('/', (req,res)=>res.json({msg: 'hey from my own server'}));

PORT = 3005;

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));