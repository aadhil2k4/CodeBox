const fs = require("fs/promises");
const path = require("path");

/**
 * Generates a file tree structure from a given directory.
 * @param {string} directory - The root directory to generate the file tree from.
 * @returns {Object} The file tree structure.
 */
async function generateFileTree(directory) {
    const tree = {};

    /**
     * Recursively builds the file tree structure.
     * @param {string} currentDir - Current directory being processed.
     * @param {Object} currentTree - Tree structure at the current level.
     */
    async function buildTree(currentDir, currentTree) {
        console.log(`Processing directory: ${currentDir}`);
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const filePath = path.join(currentDir, entry.name);
                console.log(`Found: ${filePath} (${entry.isDirectory() ? "Directory" : "File"})`);

                if (entry.isDirectory()) {
                    currentTree[entry.name] = {};
                    await buildTree(filePath, currentTree[entry.name]); // Recursively process subdirectories
                } else if (entry.isFile()) {
                    currentTree[entry.name] = null; // Null indicates a file with no children
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${currentDir}:`, error.message);
        }
    }

    try {
        console.log(`Starting to generate file tree for: ${directory}`);
        
        // Ensure the directory exists before proceeding
        const dirStats = await fs.stat(directory);
        if (!dirStats.isDirectory()) {
            throw new Error(`${directory} is not a directory`);
        }

        await buildTree(directory, tree);
        console.log(`File tree successfully generated for: ${directory}`);
    } catch (error) {
        console.error(`Error generating file tree for ${directory}:`, error.message);
    }

    return tree;
}

module.exports = {
    generateFileTree,
};
