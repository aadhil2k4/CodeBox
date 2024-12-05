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
import { debounce } from "lodash"; // Import lodash for debouncing

const Editor = () => {
  const textAreaRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const { selectedFile } = useContext(filesContext);
  const { selectedFileContent, setSelectedFileContent } = useContext(selectedFileContentContext);
  const { code, setCode } = useContext(codeContext);

  const isSaved = selectedFileContent === code;

  // Debounce the socket emission to prevent overloading with events
  const debouncedFileChange = useRef(
    debounce((newCode) => {
      socket.emit("code:update", {
        path: selectedFile,
        content: newCode,
      });
    }, 500) // Debounce for 500ms
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

      // Handle local changes (emitting only when content changes)
      editorInstanceRef.current.on("change", (instance) => {
        const newCode = instance.getValue();
        setCode(newCode);

        // Debounced update to prevent multiple events being sent too quickly
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
      // Update only if the content differs to avoid unnecessary re-renders
      if (editorInstanceRef.current.getValue() !== selectedFileContent) {
        editorInstanceRef.current.setValue(selectedFileContent);
      }
    }
  }, [selectedFileContent]);

  useEffect(() => {
    // Listen for real-time updates from other clients
    socket.on("code:update", ({ path, content }) => {
      if (path === selectedFile && editorInstanceRef.current) {
        // Update the content if the current content is different
        if (editorInstanceRef.current.getValue() !== content) {
          editorInstanceRef.current.setValue(content);
          setCode(content);
        }
      }
    });

    return () => {
      socket.off("code:update");
    };
  }, [selectedFile, setCode]);

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
    <div style={{ height: "60vh", border: "1px solid #ccc" }}>
      <textarea ref={textAreaRef} style={{ border: "1px solid red" }}></textarea>
    </div>
  );
};

export default Editor;
