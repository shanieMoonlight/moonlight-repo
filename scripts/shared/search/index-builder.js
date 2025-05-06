const lunr = require('lunr');

/**
 * Creates a Lunr search index from the documents
 * @param {Array} documents - Array of document objects to index
 * @returns {Object} - Lunr search index
 */
function createSearchIndex(documents) {
  console.log('Creating Lunr search index...');
  
  if (documents.length === 0) {
    console.warn('Warning: No documents to index!');
    return lunr(function() {
      this.ref('id');
      this.field('title');
      this.field('content');
      this.field('description');
    });
  }
  
  const index = lunr(function() {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('content');
    this.field('description', { boost: 5 });
    
    documents.forEach(doc => {
      this.add(doc);
    });
  });
  
  return index;
}

//=======================================//

module.exports = {
  createSearchIndex
};

//=======================================//