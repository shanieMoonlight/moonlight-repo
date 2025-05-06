export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

/**
 * Centralized metadata configuration for all pages
 * Used by both Angular components and search indexer
 */
export const METADATA_CONFIG: Record<string, PageMetadata> = {
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
 */
export function getMetadataForRoute(route: string): PageMetadata {
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
    title: 'Spider Baby Mini-State',
    description: 'A lightweight, signals-based state management library for Angular applications, handling loading states, errors, and success notifications while leveraging Angular\'s signals for reactivity.',
    keywords: ['Angular', 'State Management', 'Signals']
  };
}
