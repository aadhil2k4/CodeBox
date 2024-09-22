import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to the backend

export default function MonacoEditorComponent() {
  const [code, setCode] = useState('// Start typing code...');

  useEffect(() => {
    // Listen for code changes from other users
    socket.on('receive_code', (data) => {
      setCode(data);
    });

    return () => {
      socket.off('receive_code');
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Emit the code changes to the backend server
    socket.emit('code_change', newCode);
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => handleCodeChange(e.target.value)}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
}
