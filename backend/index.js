const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser'); // Process JSON payloads in API requests
const cors = require('cors'); // For cross-origin requests
const http = require('http'); // Create HTTP servers
const { Server: SocketServer } = require('socket.io'); // Realtime web socket connection
const fs = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const path = require('path'); // File path manipulations
const { generateFileTree } = require('./Utils/fileUtils');
const socketEvents = require('./Events/socketEvents');

app.use(cors());

const server = http.createServer(app); // Create HTTP server
const io = new SocketServer({ cors: { origin: '*' } }); // Allow connection from any origin

socketEvents(io);
io.attach(server); // Attach socket server and HTTP server

const authRouter = require('./Router/AuthRouter');

const PORT = process.env.PORT || 3000;
const DPORT = 9000;

// Ensure the projects directory exists
const projectsPath = path.resolve(__dirname, 'projects');
if (!existsSync(projectsPath)) {
    mkdirSync(projectsPath, { recursive: true });
    console.log(`Projects directory created: ${projectsPath}`);
}

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/files', async (req, res) => {
    try {
        const fileTree = await generateFileTree(projectsPath);
        return res.json({ tree: fileTree });
    } catch (error) {
        res.status(500).send('Error generating file tree');
    }
});

app.get('/files/content', async (req, res) => {
    const filePath = req.query.path;
    const fullPath = path.join(projectsPath, filePath);
    try {
        const content = await fs.readFile(fullPath, 'utf-8');
        return res.json({ content });
    } catch (error) {
        res.status(500).send('Error reading file content');
    }
});

app.use(bodyParser.json());
app.use('/auth', authRouter);

server.listen(DPORT, () => console.log(`🐳 Docker server running on port ${DPORT}`));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
