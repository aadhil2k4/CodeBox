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
import { filesContext, selectedFileContentContext, codeContext, roomIdContext } from "./EditorPage";
import { debounce } from "lodash";

const Editor = () => {
  const textAreaRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const { selectedFile } = useContext(filesContext);
  const { selectedFileContent, setSelectedFileContent } = useContext(selectedFileContentContext);
  const { code, setCode } = useContext(codeContext);

  const selectedFileRef = useRef(selectedFile); // Store selectedFile in a ref
  const roomId = useContext(roomIdContext);

  useEffect(() => {
    selectedFileRef.current = selectedFile; // Update ref when selectedFile changes
  }, [selectedFile]);

  const debouncedFileChange = useRef(
    debounce((newCode) => {
      console.log(`Emitting code:update for file: ${selectedFileRef.current}, Content:`, newCode);
      socket.emit("code:update", {
        path: selectedFileRef.current,
        content: newCode,
        roomId: roomId
      });
    }, 500)
  ).current;
  

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

      // Handle local changes
      editorInstanceRef.current.on("change", (instance) => {
        const newCode = instance.getValue();
        setCode(newCode);

        // Emit changes to other clients
        debouncedFileChange(newCode);
      });
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.toTextArea();
        editorInstanceRef.current = null;
      }
    };
  }, [selectedFile, setCode]);

  useEffect(() => {
    if (editorInstanceRef.current && selectedFileContent) {
      // Update only if the content differs
      if (editorInstanceRef.current.getValue() !== selectedFileContent) {
        editorInstanceRef.current.setValue(selectedFileContent);
      }
    }
  }, [selectedFileContent]);

  useEffect(() => {
    const handleCodeUpdate = ({ path, content }) => {
      if (path === selectedFile && editorInstanceRef.current) {
        const currentContent = editorInstanceRef.current.getValue();
        if (currentContent !== content) {
          // Update editor without triggering a new `code:update`
          editorInstanceRef.current.off("change");
          editorInstanceRef.current.setValue(content);
          editorInstanceRef.current.on("change", (instance) => {
            const newCode = instance.getValue();
            setCode(newCode);
            debouncedFileChange(newCode);
          });
          setCode(content);
          setSelectedFileContent(content);
        }
      }
    };
  
    socket.on("code:update", handleCodeUpdate);
  
    return () => {
      socket.off("code:update", handleCodeUpdate);
    };
  }, [selectedFile, setCode, setSelectedFileContent]);
  

  useEffect(() => {
    console.log(selectedFile)
    // Emit file changes to save content
    const saveChanges = setTimeout(() => {
      if (code && selectedFileContent !== code) {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
          roomId: roomId
        });
      }
    }, 2000);

    return () => {
      clearTimeout(saveChanges);
    };
  }, [code, selectedFile, selectedFileContent]);

  return (
    <div style={{ height: "60vh", border: "1px solid #ccc" }}>
      <textarea ref={textAreaRef} style={{ border: "1px solid red" }}></textarea>
    </div>
  );
};

export default Editor;
