export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export const METADATA_CONFIG: Record<string, PageMetadata>;

export function getMetadataForRoute(route: string): PageMetadata;
