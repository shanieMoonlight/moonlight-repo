/**
 * Metadata configuration for all pages
 * Auto-generated - Do not edit directly
 */

/**
 * @typedef {Object} PageMetadata
 * @property {string} title - The page title
 * @property {string} description - The page description
 * @property {string[]} keywords - Keywords for SEO
 * @property {string} [ogImage] - Optional Open Graph image URL
 */

/**
 * Centralized metadata configuration for all pages
 * Used by both Angular components and search indexer
 * @type {Object.<string, PageMetadata>}
 */
const METADATA_CONFIG = {
  "/": {
    "title": "Simple State",
    "description": "Basic usage of MiniState for data fetching with automatic loading state and error handling",
    "keywords": [
      "Angular",
      "State Management",
      "Signals",
      "Mini-State",
      "Angular library",
      "Reactive State"
    ]
  },
  "/api/mini-state-utility/": {
    "title": "API MiniStateUtility | Helper Functions for State Management",
    "description": "MiniStateUtility provides helper functions for combining multiple MiniState instances and managing their combined state in Angular applications.",
    "keywords": [
      "API",
      "Angular",
      "State Management",
      "MiniState",
      "Utility Functions",
      "Combining States"
    ]
  },
  "/api/mini-state-crud/": {
    "title": "API MiniStateCrud | CRUD Operations for Collections",
    "description": "MiniStateCrud extends MiniState to provide specialized functionality for managing collections with Create, Read, Update, and Delete operations in Angular applications.",
    "keywords": [
      "API",
      "Angular",
      "State Management",
      "MiniState",
      "CRUD Operations",
      "Collection Management"
    ]
  },
  "/api/mini-state-combined/": {
    "title": "API MiniStateCombined | Aggregate Multiple State Instances",
    "description": "MiniStateCombined aggregates multiple MiniState instances to provide unified loading, error, and success states for complex Angular application workflows.",
    "keywords": [
      "API",
      "Angular",
      "State Management",
      "MiniState",
      "Combined States",
      "State Aggregation"
    ]
  },
  "/api/mini-state-builder/": {
    "title": "API MiniStateBuilder | Fluent API for State Creation",
    "description": "MiniStateBuilder provides a fluent API for creating and configuring MiniState instances with automatic handling of DestroyRef and resource cleanup.",
    "keywords": [
      "API",
      "Angular",
      "State Management",
      "MiniStateBuilder",
      "Fluent API",
      "Builder Pattern"
    ]
  },
  "/api/mini-state/": {
    "title": "API MiniState | Core Class for Async State Management",
    "description": "MiniState is the core class for managing async operations with automatic handling of loading states, errors, and success messages in Angular applications.",
    "keywords": [
      "API",
      "Angular",
      "State Management",
      "MiniState",
      "Async Operations",
      "Loading States",
      "Error Handling"
    ]
  },
  "/api/": {
    "title": "MiniState",
    "description": "Core class for managing async operations with automatic handling of loading states, errors, and success messages.",
    "keywords": [
      "API",
      "Angular",
      "State Management",
      "Signals",
      "Mini-State",
      "Angular library",
      "Reactive State"
    ]
  }
};

/**
 * Get metadata for a specific route
 * Falls back to default values if route not found
 * @param {string} route - The route to get metadata for
 * @returns {PageMetadata} The metadata for the route
 */
function getMetadataForRoute(route) {
  // Normalize route
  const normalizedRoute = route.endsWith('/') ? route : `${route}/`;
  
  // Find exact match first
  if (METADATA_CONFIG[route]) {
    return METADATA_CONFIG[route];
  }
  
  // Try with normalized route
  if (METADATA_CONFIG[normalizedRoute]) {
    return METADATA_CONFIG[normalizedRoute];
  }
  
  // Fall back to default metadata
  return {
    title: 'Spider Baby mini-state',
    description: 'A lightweight, signals-based state management library for Angular applications.',
    keywords: ["Angular","State Management","Signals"]
  };
}

// Export for CommonJS modules (Node.js)
module.exports = {
  METADATA_CONFIG,
  getMetadataForRoute
};
