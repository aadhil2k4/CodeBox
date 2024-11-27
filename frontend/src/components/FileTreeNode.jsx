import React from 'react';
import FolderIcon from "@mui/icons-material/Folder"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"

const FileTreeNode = ({ name, nodes, onSelect, path }) => {

    const isDir = !!nodes

    return (
        <div onClick={(e)=>{
            e.stopPropagation();
            if(isDir) return;
            onSelect(path)
        }}>
            <p>
            {isDir ? (
                    <FolderIcon style={{ marginRight: '8px', color: '#FFD700' }} />
                ) : (
                    <InsertDriveFileIcon style={{ marginRight: '8px', color: '#90CAF9' }} />
                )}   
                {name}
            </p>
            {nodes && name!=="node_modules" && (
                <ul style={{listStyleType:"none", lineHeight:"20px"}}>
                    {Object.keys(nodes).map(child => (
                        <li key={child}>
                            <FileTreeNode
                                name={child}
                                nodes={nodes[child]}
                                path={path + '/' + child}
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
