const fs = require('fs');
const path = require('path');
const { processDirectory, ensureDirectoryExists, writeJsonFile } = require('../shared/search/file-utils');
const { createSearchIndex } = require('../shared/search/index-builder');

console.log('Starting search index generation...');

const args = process.argv.slice(2);
const DEBUG_MODE = args.includes('--debug');

const CONFIG = {
  indexPath: '/api', // Change to '' to index everything
  excludedPaths: ['/api/home'], // Paths to exclude from indexing
  debug: DEBUG_MODE
};
console.log('Debug mode:', CONFIG.debug ? 'Enabled' : 'Disabled');

// Define paths relative to the script location or workspace root
const workspaceRoot = path.join(__dirname, '../..');
console.log('Workspace root:', workspaceRoot);
 
const prerenderedDir = path.join(workspaceRoot, 'dist/apps/mini-state/demo/browser');

let outputDir;
if (CONFIG.debug) {
  outputDir = path.join(workspaceRoot, 'apps/mini-state/demo/public/search');
  console.log('Using debug output directory for testing');
} else {
  outputDir = path.join(workspaceRoot, 'dist/apps/mini-state/demo/browser/search');
}

const outputFilePath = path.join(outputDir, 'search-index.json');
const documentsFilePath = path.join(outputDir, 'search-documents.json');

console.log('Prerendered directory:', prerenderedDir);
console.log('Directory exists:', fs.existsSync(prerenderedDir));

/**
 * Extracts search content from prerendered HTML files
 */
function extractSearchContent() {
  console.log('Extracting search content from prerendered routes...');
  
  // Stats object to keep track of processing
  const stats = {
    documentId: 1,
    filesProcessed: 0,
    apiFilesProcessed: 0
  };
  
  // Start processing from the prerendered directory
  const documents = processDirectory(
    prerenderedDir, 
    '', 
    prerenderedDir, 
    CONFIG, 
    stats
  );
  
  console.log(`Total files processed: ${stats.filesProcessed}`);
  console.log(`API files processed: ${stats.apiFilesProcessed}`);
  console.log(`Total API documents extracted: ${documents.length}`);
  
  return documents;
}

/**
 * Main function to generate the search index
 */
async function generateSearchIndex() {
  try {
    // Ensure output directory exists
    ensureDirectoryExists(outputDir);
    
    // Extract content from prerendered HTML files
    const documents = extractSearchContent();
    console.log(`Extracted ${documents.length} documents`);
    
    // Generate the search index
    const index = createSearchIndex(documents);
    
    // Save the documents separately from the index
    writeJsonFile(documentsFilePath, documents);
    
    // Save the index
    writeJsonFile(outputFilePath, index);
    
    console.log('Search index generation completed successfully');
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();