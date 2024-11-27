const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const {Server: SocketServer } = require('socket.io');
const pty = require("node-pty");
const fs = require("fs/promises");
const path = require('path');
const chokidar = require('chokidar')

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

io.attach(server);

ptyProcess.onData(data => {
    io.emit('terminal:data', data);
})

io.on('connection', (socket)=>{
    console.log(`Socket connected`, socket.id);
    socket.emit('file:refresh');
    socket.on('file:change', async ({path, content}) => {
        await fs.writeFile(`./user${path}`, content)
    })
    socket.on('terminal:write', (data)=>{
        ptyProcess.write(data);
    })
})

chokidar.watch('./user').on('all', async (event, path) => {
    const fileTree = await generateFileTree('./user');
    io.emit('file:refresh', fileTree);  // Emit updated file structure
});


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
    const content = await fs.readFile(`./user${path}`, `utf-8`)
    return res.json({content});
})


app.use(bodyParser.json());
app.use('/auth', authRouter);

server.listen(DPORT, ()=>console.log(`🐳 Docker server runninig on port ${DPORT}`))
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

async function generateFileTree(directory) {
    const tree = {};

    async function buildTree(currentDir, currentTree) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                const filePath = path.join(currentDir, entry.name);
                if (entry.isDirectory()) {
                    currentTree[entry.name] = {};
                    await buildTree(filePath, currentTree[entry.name]);
                } else if (entry.isFile()) {
                    currentTree[entry.name] = null;
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${currentDir}:`, error.message);
        }
    }

    await buildTree(directory, tree);
    return tree;
}
