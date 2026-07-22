export interface Logger { debug(message: string, context?: unknown): void; info(message: string, context?: unknown): void; warn(message: string, context?: unknown): void; error(message: string, context?: unknown): void; }

export function createLogger(debugEnabled: boolean): Logger {
  return {
    debug: (message, context) => { if (debugEnabled) console.debug(message, context ?? ''); },
    info: (message, context) => console.info(message, context ?? ''),
    warn: (message, context) => console.warn(message, context ?? ''),
    error: (message, context) => console.error(message, context ?? ''),
  };
}
