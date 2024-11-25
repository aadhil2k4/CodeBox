import React, { useEffect, useRef } from "react";
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

const Editor = () => {
  const textAreaRef = useRef(null);
  const editorInstanceRef = useRef(null); 

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
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.toTextArea(); 
        editorInstanceRef.current = null; 
      }
    };
  }, []);

  return (
    <div style={{ height: "600px" }}>
      <textarea ref={textAreaRef}></textarea>
    </div>
  );
};

export default Editor;
