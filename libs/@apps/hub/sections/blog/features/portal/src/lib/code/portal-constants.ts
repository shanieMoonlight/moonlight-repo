export const PortalConstantsCode = `// portal-constants.ts
export const DEFAULT_NAME = 'default-portal';

export interface PortalInfo {
  name: string;
  isAttached: boolean;
  timestamp: number;
}

export interface PortalMap {
  [name: string]: Portal<any> | null;
}`;
