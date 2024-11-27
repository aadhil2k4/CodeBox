import React, { useContext, useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/xml/xml";
import CodeMirror from "codemirror";
import socket from "../socket";
import { filesContext, selectedFileContentContext, codeContext } from "./EditorPage";

const Editor = () => {
  const textAreaRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const { selectedFile } = useContext(filesContext);
  const { selectedFileContent, setSelectedFileContent } = useContext(selectedFileContentContext);
  const { code, setCode } = useContext(codeContext);

  const isSaved = selectedFileContent === code;

  // Initialize CodeMirror editor
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

      // Sync changes in the editor with `code` state
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
  }, [setCode]);

  // Update the editor content when `selectedFileContent` changes
  useEffect(() => {
    if (editorInstanceRef.current && selectedFileContent) {
      editorInstanceRef.current.setValue(selectedFileContent);
    }
  }, [selectedFileContent]);

  // Auto-save file content
  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, isSaved, selectedFile]);

  return (
    <div style={{ height: "60vh" }}>
      <textarea ref={textAreaRef}></textarea>
    </div>
  );
};

export default Editor;
