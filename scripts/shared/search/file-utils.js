const fs = require('fs');
const path = require('path');
const { extractDocumentFromFile } = require('./content-extractor');

/**
 * Recursively processes directories to find HTML files for indexing
 * @param {string} dirPath - Directory to process
 * @param {string} routePrefix - Current route prefix for the directory
 * @param {string} prerenderedDir - Base directory for route calculation
 * @param {Object} config - Configuration options
 * @param {Object} stats - Statistics object to update
 * @returns {Array} - Array of document objects
 */
function processDirectory(dirPath, routePrefix, prerenderedDir, config, stats) {
  console.log(`Processing directory: ${dirPath}`);
  
  const documents = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  console.log(`Found ${entries.length} entries in directory`);
  
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    
    // Calculate the route for the current entry
    const routePart = entry.name;
    const currentRoute = routePrefix ? `${routePrefix}/${routePart}` : `/${routePart}`;
    
    // Check if this path should be indexed
    const isInTargetPath = !config.indexPath || currentRoute.startsWith(config.indexPath);
    const isExcluded = config.excludedPaths.some(excludedPath => 
      currentRoute.startsWith(excludedPath)
    );
    const shouldIndexPath = isInTargetPath && !isExcluded;
    
    if (entry.isDirectory()) {
      // If it's a directory, process it recursively
      const subdirDocuments = processDirectory(
        entryPath, 
        currentRoute, 
        prerenderedDir, 
        config, 
        stats
      );
      documents.push(...subdirDocuments);
    } else if (entry.name.endsWith('.html') && shouldIndexPath) {
      // Only process HTML files that should be indexed
      stats.filesProcessed++;
      stats.apiFilesProcessed++;
      
      console.log(`Processing API HTML file (${stats.apiFilesProcessed}): ${entryPath}`);
      
      const doc = extractDocumentFromFile(entryPath, prerenderedDir, config);
      if (doc) {
        // Add the document with an ID
        documents.push({
          id: String(stats.documentId++),
          ...doc
        });
        
        console.log(`Added API document: ${doc.route} (${doc.title})`);
      }
    } else if (entry.name.endsWith('.html')) {
      // Count non-API HTML files but don't process them
      stats.filesProcessed++;
      console.log(`Skipping non-API HTML file: ${entryPath}`);
    }
  }
  
  return documents;
}

//---------------------------------------//

/**
 * Ensures output directory exists
 * @param {string} dirPath - Directory path to create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

//---------------------------------------//

/**
 * Writes data to a file
 * @param {string} filePath - File path to write to
 * @param {Object} data - Data to write (will be stringified)
 */
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
  console.log(`Saved file to ${filePath}`);
}

//=======================================//

module.exports = {
  processDirectory,
  ensureDirectoryExists,
  writeJsonFile
};

//=======================================//