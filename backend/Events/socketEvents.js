const chokidar = require('chokidar');
const fs = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const { generateFileTree } = require('../Utils/fileUtils');
const pty = require('node-pty');
const os = require('os');
const path = require('path');

module.exports = (io) => {
    const roomDirectories = new Map(); // Maps roomId to an array of directories

    io.on('connection', async (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('room:join', async ({ roomId, username, projectName }) => {
            if (!roomId || !username || !projectName) {
                console.log(`Missing ${roomId}, ${username}, or ${projectName}`);
                return;
            }

            const projectPath = path.resolve(__dirname, '../projects', projectName); // Store projects in a dedicated folder
            if (!existsSync(projectPath)) {
                mkdirSync(projectPath, { recursive: true }); // Create the project directory if it doesn't exist
                console.log(`Project directory created: ${projectPath}`);
            }

            socket.join(roomId);

            if (!roomDirectories.has(roomId)) {
                roomDirectories.set(roomId, new Set());
            }
            roomDirectories.get(roomId).add(projectPath);

            console.log(`User ${username} joined room ${roomId} with project ${projectName}`);

            // Notify all users in the room
            io.to(roomId).emit('room:notification', {
                message: `${username} has joined the room`,
                users: Array.from(io.sockets.adapter.rooms.get(roomId) || []),
            });

            // Emit the initial file tree for this user's project directory
            try {
                const initialFileTree = await generateFileTree(projectPath);
                socket.emit('file:refresh', initialFileTree);
            } catch (error) {
                console.error('Error generating initial file tree:', error);
            }

            // Start a terminal in the project folder
            const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

            const socketPty = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: projectPath, // Set terminal's working directory to the project folder
                env: process.env,
            });

            socketPty.onData((data) => {
                socket.emit('terminal:data', data);
            });

            socket.on('terminal:write', (data) => {
                socketPty.write(data);
            });

            // Handle terminal resizing
            socket.on('terminal:resize', ({ cols, rows }) => {
                socketPty.resize(cols, rows);
            });

            // Handle client disconnection
            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${socket.id}`);
                socketPty.kill();
            });
        });

        // Handle real-time code updates
        socket.on('code:update', ({ path, content, roomId }) => {
            console.log(`Received code update for path: ${path}`);
            if (path && content) {
                console.log(`Code updated in file: ${path}`);
                io.to(roomId).emit('code:update', { path, content }); // Emit to all clients in the room
            }
        });

        // Handle file changes
        socket.on('file:change', async ({ path, content, roomId }) => {
            if (path && content) {
                try {
                    console.log(`File change detected: ${path}`);
                    await fs.writeFile(path, content);

                    const roomPaths = Array.from(roomDirectories.get(roomId) || []);
                    for (const directory of roomPaths) {
                        const updatedFileTree = await generateFileTree(directory);
                        io.to(roomId).emit('file:refresh', updatedFileTree);
                    }
                } catch (error) {
                    console.error('Error writing file:', error);
                }
            }
        });
    });

    // Watch for changes in all project directories
    chokidar.watch(path.resolve(__dirname, '../projects')).on('all', async (event, filePath) => {
        if (['add', 'change', 'unlink'].includes(event)) {
            try {
                for (const [roomId, directories] of roomDirectories.entries()) {
                    for (const directory of directories) {
                        if (filePath.startsWith(directory)) {
                            const fileTree = await generateFileTree(directory);
                            io.to(roomId).emit('file:refresh', fileTree);
                            console.log(`File tree updated for room ${roomId} due to ${event} at ${filePath}`);
                        }
                    }
                }
            } catch (error) {
                console.error('Error watching file system:', error);
            }
        }
    });
};
