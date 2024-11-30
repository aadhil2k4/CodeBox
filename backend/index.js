const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');  //process json payloads in api reqs
const cors = require('cors');   //for cross origin requests
const http = require('http')    //create http servers
const {Server: SocketServer } = require('socket.io');   //realtime web socket connection
const pty = require("node-pty");    //pseudoterminal functionality
const chokidar = require('chokidar');   //monitor file system changes
const { generateFileTree } = require('./Utils/fileUtils')
const socketEvents = require('./Events/socketEvents');
const fs = require('fs/promises');  //for asynchronous file system operations
const path = require('path');   //file path manipulations

app.use(cors());

const ptyProcess = pty.spawn('bash', [], {     //spawn a terminal emulator
    name: 'xtern-color',        //terminal type for colored output
    cols: 80,
    rows:30,
    cwd: process.env.INIT_CWD + "/user",    //current working directory
    env: process.env
}) 

const server = http.createServer(app);  //Create http server

const io = new SocketServer({   //Create websocket
    cors: {origin: '*'} //Allow connection from any origin
})

socketEvents(io, ptyProcess)    

io.attach(server);  //attach socket server and http server

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
