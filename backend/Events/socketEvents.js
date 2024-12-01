const chokidar = require('chokidar');
const fs = require('fs/promises');
const { generateFileTree } = require('../Utils/fileUtils');
const pty = require('node-pty');
const os = require('os')

module.exports = (io) => {
    io.on('connection', (socket) => {       //Listen for new socket connections
        console.log(`Socket connected: ${socket.id}`);

        const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

        const socketPty = pty.spawn(shell, [], {     //spawn a terminal emulator
            name: 'xtern-color',        //terminal type for colored output
            cols: 80,
            rows:30,
            cwd: process.env.INIT_CWD + "/user",    //current working directory
            env: process.env
        }) 

        socket.emit('file:refresh');    //fetch latest file data

        socketPty.onData((data)=>{
            socket.emit('terminal:data', data);
        })

        socket.on('terminal:write', (data) => {     //Listen for terminal changes
            socketPty.write(data);     //send data to pseudoterminal process running on server
        });

        socket.on('file:change', async ({ path, content }) => {     //Listen for file changes
            await fs.writeFile(`./user${path}`, content);   //Write the new content to local filesystem
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            socketPty.kill(); // Terminate the pty process
        });

    });

    chokidar.watch('./user').on('all', async () => {    //Monitor user directory for "all" file changes
        const fileTree = await generateFileTree('./user');  //Regenerate file tree structure on change
        io.emit('file:refresh', fileTree); // Emit updated file structure
    });
};
