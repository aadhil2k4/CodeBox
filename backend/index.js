const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const {Server: SocketServer } = require('socket.io');

const server = http.createServer(app);
const io = new SocketServer({
    cors: '*'
})
io.attach(server);
io.on('Connection', (socket)=>{
    console.log(`Socket connected`, socket.id);
})

const authRouter = require('./Router/AuthRouter');

const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send('Hi');
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRouter);

server.listen(9000, ()=>console.log(`🐳 Docker server runninig on port 9000`))
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
