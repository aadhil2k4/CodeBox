const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const {Server: SocketServer } = require('socket.io');
const pty = require("node-pty");
const chokidar = require('chokidar');
const { generateFileTree } = require('./Utils/fileUtils')
const socketEvents = require('./Events/socketEvents');
const fs = require('fs/promises'); 
const path = require('path');

app.use(cors());

const ptyProcess = pty.spawn('bash', [], {
    name: 'xtern-color',
    cols: 80,
    rows:30,
    cwd: process.env.INIT_CWD + "/user",
    env: process.env
}) 

const server = http.createServer(app);
const io = new SocketServer({
    cors: {origin: '*'}
})
socketEvents(io, ptyProcess)
io.attach(server);

const authRouter = require('./Router/AuthRouter');

const PORT = process.env.PORT || 3000;
const DPORT = 9000

app.get('/', (req,res)=>{
    res.send('Hi');
})

app.get('/files', async (req, res) => {
    try {
        const fileTree = await generateFileTree('./user');
        return res.json({ tree: fileTree });
    } catch (error) {
        res.status(500).send('Error generating file tree');
    }
});

app.get('/files/content', async(req,res)=>{
    const path = req.query.path;
    const content = await fs.readFile(`./user${path}`, 'utf-8')
    return res.json({content});
})


app.use(bodyParser.json());
app.use('/auth', authRouter);

server.listen(DPORT, ()=>console.log(`🐳 Docker server runninig on port ${DPORT}`))
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
