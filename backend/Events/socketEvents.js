const chokidar = require('chokidar');
const fs = require('fs/promises');
const { generateFileTree } = require('../Utils/fileUtils');
const pty = require('node-pty');
const os = require('os');
const path = require('path')

module.exports = (io) => {

    const roomPath = new Map();

    io.on('connection', async (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('room:join', async({roomId, username})=>{
            if(!roomId || !username){
                console.log('No roomId/username');
            }
            socket.join(roomId);
            roomPath.set(roomId, path.resolve('./user'))
            console.log(`User ${username} joined room: ${roomId}`)

            io.to(roomId).emit('room:notification', {
                meassage: `${username} has joined the room`,
                users: Array.from(io.sockets.adapter.rooms.get(roomId) || [])
            })
        })

        // Emit initial file tree to the newly connected client
        try {
            const initialFileTree = await generateFileTree('./user');
            socket.emit('file:refresh', initialFileTree);
        } catch (error) {
            console.error('Error generating initial file tree:', error);
        }

        const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

        const socketPty = pty.spawn(shell, [], {
            name: 'xtern-color',
            cols: 80,
            rows: 30,
            cwd: process.env.INIT_CWD + "/user",
            env: process.env,
        });

        socketPty.onData((data) => {
            socket.emit('terminal:data', data);
        });

        socket.on('terminal:write', (data) => {
            socketPty.write(data);
        });

        // Handle real-time code updates
        socket.on('code:update', ({ path, content, roomId }) => {
            console.log(`Received code update for path: ${path}`);
            if (path && content) {
                console.log(`Code updated in file: ${path}`);
                // Emit to all clients (including the sender) to ensure real-time updates everywhere
                io.to(roomId).emit('code:update', { path, content });
            }
        });
        

        // Handle file changes
        socket.on('file:change', async ({ path, content, roomId }) => {
            if (path && content) {
                try {
                    console.log(`File change detected: ${path}`);
                    await fs.writeFile(`./user${path}`, content);
                    const updatedFileTree = await generateFileTree('./user');
                    io.to(roomId).emit('file:refresh', updatedFileTree); // Broadcast updated file tree to all clients
                } catch (error) {
                    console.error('Error writing file:', error);
                }
            }
        });

        // Handle client disconnection
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            socketPty.kill();
        });
    });

    // Watch for changes in the user directory
    chokidar.watch('./user').on('all', async (event, path) => {
        if (event === 'add' || event === 'change' || event === 'unlink') {
            try {
                const fileTree = await generateFileTree('./user');
                console.log(`File Tree updated due to ${event} at ${path}`)
                for (const [roomId, roomBasePath] of roomPath.entries()) {
                    // Check if the changed file is within this room's base path
                    if (path.startsWith(roomBasePath)) {
                        io.to(roomId).emit('file:refresh', fileTree);
                        console.log(`File Tree updated for room ${roomId} due to ${event} at ${filePath}`);
                    }
                }
            } catch (error) {
                console.error('Error watching file system:', error);
            }
        }
    });
};
