import React, {useEffect, useRef} from 'react'
import { Terminal as XTerminal} from 'xterm'
import "xterm/css/xterm.css"
import socket from '../socket'

const Terminal = () => {
    const terminalRef = useRef();
    const isRendered = useRef(false)

    useEffect(()=>{
        if(isRendered.current) return;
        isRendered.current = true;
        const term = new XTerminal({
            rows:20
        });
        term.open(terminalRef.current);
        term.onData(data=>{
            socket.emit('terminal:write', data);
        })
        socket.on('terminal:data', (data)=>{
            term.write(data);
        });
    },[])

  return (
    <>
    <div id="terminal" ref={terminalRef} style={{marginTop:"10px", height:"10px"}}/>
    </>
  )
}

export default Terminal