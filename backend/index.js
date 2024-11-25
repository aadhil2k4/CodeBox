const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const {Server: SocketServer } = require('socket.io');
const pty = require("node-pty");
const fs = require("fs/promises")

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

io.attach(server);

ptyProcess.onData(data => {
    io.emit('terminal:data', data);
})

io.on('connection', (socket)=>{
    console.log(`Socket connected`, socket.id);
    socket.on('terminal:write', (data)=>{
        ptyProcess.write(data);
    })
})

const authRouter = require('./Router/AuthRouter');

const PORT = process.env.PORT || 3000;
const DPORT = 9000

app.get('/', (req,res)=>{
    res.send('Hi');
})

app.get('/files', async (req,res)=>{
    const fileTree = await generateFileTree('./user');
    return res.json({tree: fileTree})
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRouter);

server.listen(DPORT, ()=>console.log(`🐳 Docker server runninig on port ${DPORT}`))
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

function generateFileTree(directory){
    const tree={}

    async function buildTree(currentDir, currentTree){
        const files = await fs.readdir(currentDir);
        for(const file of files){
            const filePath = path.join(currentDir, file);
            const  stat = await fs.stat(filePath);
            if(stat.isDirectory){
                currentTree[file] = {};
                buildTree(filePath, currentTree[file]);
            }else{
                currentTree[file] = null;
            }
        }
    }

    return tree;
}
