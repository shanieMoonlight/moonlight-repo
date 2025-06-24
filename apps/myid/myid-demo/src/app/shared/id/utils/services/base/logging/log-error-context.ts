export interface LogErrorContext {
  error: unknown;
  method: string;
  accessToken?: string | null;
  [key: string]: unknown; // for extensibility
}