import React, { useContext, useEffect, useRef, useState } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/python/python"
import "codemirror//mode/clike/clike";
import "codemirror/mode/css/css"
import "codemirror/mode/htmlmixed/htmlmixed"
import "codemirror/mode/xml/xml"
import CodeMirror from "codemirror";
import socket from "../socket"
import { filesContext } from "./EditorPage";

const Editor = () => {
  const textAreaRef = useRef(null);
  const editorInstanceRef = useRef(null); 
  const [code, setCode] = useState('')
  const {selectedFile, setSelectedFile} = useContext(filesContext)

  useEffect(() => {
    if (!editorInstanceRef.current && textAreaRef.current) {
      editorInstanceRef.current = CodeMirror.fromTextArea(textAreaRef.current, {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      editorInstanceRef.current.setSize("100%", "100%");

      editorInstanceRef.current.on("change", (instance) => {
        setCode(instance.getValue()); 
      });
    
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.toTextArea(); 
        editorInstanceRef.current = null; 
      }
    };
  }, []);

  useEffect(()=>{
    if(code){
      const timer = setTimeout(()=>{
        socket.emit('file:change', {
          path: selectedFile,
          content: code
        });
      }, 5000)
      return ()=>{
        clearTimeout(timer)
      }
    }
  },[code])

  return (
    <div style={{ height: "60vh" }}>
      <textarea ref={textAreaRef}></textarea>
    </div>
  );
};

export default Editor;
