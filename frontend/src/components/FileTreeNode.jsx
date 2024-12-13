import React from 'react';
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const FileTreeNode = ({ name, nodes, onSelect, path }) => {
    const isDir = !!nodes;  // Check if the node is a directory

    return (
        <div onClick={(e) => {
            e.stopPropagation();
            // If it's a file, invoke the onSelect with the path
            if (!isDir) {
                onSelect(path);  // Send the full path to the onSelect function
            }
        }}>
            <p>
                {isDir ? (
                    <FolderIcon style={{ marginRight: '8px', color: '#FFD700' }} />
                ) : (
                    <InsertDriveFileIcon style={{ marginRight: '8px', color: '#90CAF9' }} />
                )}
                {name}
            </p>

            {/* Render children nodes for directories */}
            {isDir && name !== "node_modules" && (
                <ul style={{ listStyleType: "none", lineHeight: "20px" }}>
                    {Object.keys(nodes).map(child => (
                        <li key={child}>
                            <FileTreeNode
                                name={child}
                                nodes={nodes[child]}
                                path={path+ '/' + child}  // Pass full path to the child
                                onSelect={onSelect}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileTreeNode;
