const chokidar = require('chokidar');
const fs = require('fs/promises');
const { generateFileTree } = require('../Utils/fileUtils');

module.exports = (io, ptyProcess) => {
    ptyProcess.onData((data) => {   //Listen for output from pty
        io.emit('terminal:data', data); //send terminal output to all connected clients
    });

    io.on('connection', (socket) => {       //Listen for new socket connections
        console.log(`Socket connected: ${socket.id}`);

        socket.emit('file:refresh');    //fetch latest file data

        socket.on('file:change', async ({ path, content }) => {     //Listen for file changes
            await fs.writeFile(`./user${path}`, content);   //Write the new content to local filesystem
        });

        socket.on('terminal:write', (data) => {     //Listen for terminal changes
            ptyProcess.write(data);     //send data to pseudoterminal process running on server
        });
    });

    chokidar.watch('./user').on('all', async () => {    //Monitor user directory for "all" file changes
        const fileTree = await generateFileTree('./user');  //Regenerate file tree structure on change
        io.emit('file:refresh', fileTree); // Emit updated file structure
    });
};
