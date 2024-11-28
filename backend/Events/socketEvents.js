const chokidar = require('chokidar');
const fs = require('fs/promises');
const { generateFileTree } = require('../Utils/fileUtils');

module.exports = (io, ptyProcess) => {
    ptyProcess.onData((data) => {
        io.emit('terminal:data', data);
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.emit('file:refresh');

        socket.on('file:change', async ({ path, content }) => {
            await fs.writeFile(`./user${path}`, content);
        });

        socket.on('terminal:write', (data) => {
            ptyProcess.write(data);
        });
    });

    chokidar.watch('./user').on('all', async () => {
        const fileTree = await generateFileTree('./user');
        io.emit('file:refresh', fileTree); // Emit updated file structure
    });
};
