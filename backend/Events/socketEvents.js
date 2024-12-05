const chokidar = require('chokidar');
const fs = require('fs/promises');
const { generateFileTree } = require('../Utils/fileUtils');
const pty = require('node-pty');
const os = require('os');

module.exports = (io) => {
    io.on('connection', async (socket) => {       // Listen for new socket connections
        console.log(`Socket connected: ${socket.id}`);

        // Emit initial file tree when a user connects
        try {
            const initialFileTree = await generateFileTree('./user');
            socket.emit('file:refresh', initialFileTree);
        } catch (error) {
            console.error('Error generating initial file tree:', error);
        }

        const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

        const socketPty = pty.spawn(shell, [], {     // Spawn a terminal emulator
            name: 'xtern-color',        // Terminal type for colored output
            cols: 80,
            rows: 30,
            cwd: process.env.INIT_CWD + "/user",    // Current working directory
            env: process.env
        });

        socketPty.onData((data) => {
            socket.emit('terminal:data', data);
        });

        socket.on('terminal:write', (data) => {     // Listen for terminal changes
            socketPty.write(data);     // Send data to pseudoterminal process running on server
        });

        socket.on('file:change', async ({ path, content }) => {     // Listen for file changes
            try {
                await fs.writeFile(`./user${path}`, content);   // Write the new content to local filesystem
                const updatedFileTree = await generateFileTree('./user');
                io.emit('file:refresh', updatedFileTree); // Broadcast updated file tree to all clients
            } catch (error) {
                console.error('Error writing file:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            socketPty.kill(); // Terminate the pty process
        });
    });

    chokidar.watch('./user').on('all', async () => {    // Monitor user directory for "all" file changes
        try {
            const fileTree = await generateFileTree('./user');  // Regenerate file tree structure on change
            io.emit('file:refresh', fileTree); // Emit updated file structure
        } catch (error) {
            console.error('Error watching file system:', error);
        }
    });
};
