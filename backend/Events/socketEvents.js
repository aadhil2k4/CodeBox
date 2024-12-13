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
        
            // Resolve project path directly in the root folder
            const projectPath = path.resolve(__dirname, '..', projectName);
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
        
            // Terminal setup
            const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
            const socketPty = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: projectPath, // Terminal working directory set to project folder
                env: process.env,
            });
        
            socketPty.onData((data) => {
                socket.emit('terminal:data', data);
            });
        
            socket.on('terminal:write', (data) => {
                socketPty.write(data);
            });
        
            socket.on('terminal:resize', ({ cols, rows }) => {
                socketPty.resize(cols, rows);
            });
        
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
        socket.on('file:change', async ({ path: filePath, content, roomId }) => {
            if (filePath && content) {
                try {
                    const roomPaths = Array.from(roomDirectories.get(roomId) || []);
                    
                    if (roomPaths.length === 0) {
                        console.error('No room paths found for roomId:', roomId);
                        return;
                    }
        
                    // More explicit path resolution
                    let resolvedPath;
                    if (roomPaths.some(directory => filePath.startsWith(directory))) {
                        resolvedPath = filePath;
                    } else {
                        // Ensure we're creating the file in the first room path
                        resolvedPath = path.join(roomPaths[0], filePath);
                    }
        
                    // Ensure the directory exists
                    const directoryPath = path.dirname(resolvedPath);
                    await fs.mkdir(directoryPath, { recursive: true });
        
                    // Detailed logging
                    console.log('File write details:', {
                        originalPath: filePath,
                        resolvedPath: resolvedPath,
                        roomPaths: roomPaths,
                        directoryPath: directoryPath
                    });
        
                    // Write the file
                    await fs.writeFile(resolvedPath, content, { 
                        encoding: 'utf-8',
                        mode: 0o755 // Add write permissions
                    });
        
                    console.log(`File successfully written: ${resolvedPath}`);
        
                    // Refresh file tree for all directories in the room
                    for (const directory of roomPaths) {
                        try {
                            const updatedFileTree = await generateFileTree(directory);
                            io.to(roomId).emit('file:refresh', updatedFileTree);
                        } catch (treeError) {
                            console.error(`Error generating file tree for ${directory}:`, treeError);
                        }
                    }
                } catch (error) {
                    console.error('Comprehensive error writing file:', {
                        errorMessage: error.message,
                        errorCode: error.code,
                        errorPath: error.path,
                        fullError: error
                    });
        
                    // Emit error back to the client
                    socket.emit('file:write-error', {
                        message: error.message,
                        path: filePath
                    });
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
