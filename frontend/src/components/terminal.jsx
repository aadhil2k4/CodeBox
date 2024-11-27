import React, {useEffect, useRef} from 'react';
import { Terminal as XTerminal } from 'xterm';
import "xterm/css/xterm.css";
import socket from '../socket';

const Terminal = () => {
    const terminalRef = useRef();
    const isRendered = useRef(false);

    useEffect(() => {
        if (isRendered.current) return;
        isRendered.current = true;
        const term = new XTerminal({
            rows: 20
        });
        term.open(terminalRef.current);
    
        term.onData(data => {
            socket.emit('terminal:write', data);
        });
        function onTerminalData(data) {
            if (typeof data === 'string') {  
                term.write(data);
            } else {
                console.error('Received non-string data in terminal:', data);
            }
        }
        socket.on('terminal:data', onTerminalData);
    }, []);
    
    return (
        <>
            <div id="terminal" ref={terminalRef} style={{
                marginTop: "10px",
                height: "30vh", 
                overflow: "auto", 
                border: "1px solid #ccc"}} 
                />
        </>
    );
};

export default Terminal;
