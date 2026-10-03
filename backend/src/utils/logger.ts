const getTimestamp = (): string => {
  return new Date().toISOString();
};

export const logger = {
  info(message: string, meta?: unknown): void {
    console.log(
      `[${getTimestamp()}] INFO: ${message}`,
      meta ?? ""
    );
  },

  warn(message: string, meta?: unknown): void {
    console.warn(
      `[${getTimestamp()}] WARN: ${message}`,
      meta ?? ""
    );
  },

  error(message: string, error?: unknown): void {
    console.error(
      `[${getTimestamp()}] ERROR: ${message}`,
      error ?? ""
    );
  },
};