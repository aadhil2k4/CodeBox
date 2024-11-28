const fs = require("fs/promises");
const path = require('path');

async function generateFileTree(directory) {
    const tree = {};

    async function buildTree(currentDir, currentTree) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                const filePath = path.join(currentDir, entry.name);
                if (entry.isDirectory()) {
                    currentTree[entry.name] = {};
                    await buildTree(filePath, currentTree[entry.name]);
                } else if (entry.isFile()) {
                    currentTree[entry.name] = null;
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${currentDir}:`, error.message);
        }
    }

    await buildTree(directory, tree);
    return tree;
}

module.exports = {
    generateFileTree, 
}