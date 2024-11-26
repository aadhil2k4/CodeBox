import React from 'react';
import FileTreeNode from './FileTreeNode';

const FileTree = ({ tree, onSelect }) => {
    return (
        <div>
            <FileTreeNode
                name="/"
                nodes={tree}
                onSelect={onSelect}
                path=""
            />
        </div>
    );
};

export default FileTree;
