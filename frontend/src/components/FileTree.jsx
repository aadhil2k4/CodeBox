import React from 'react';
import FileTreeNode from './FileTreeNode';

const FileTree = ({ tree }) => {
    return (
        <div>
            <FileTreeNode
                name="/"
                nodes={tree}
            />
        </div>
    );
};

export default FileTree;
