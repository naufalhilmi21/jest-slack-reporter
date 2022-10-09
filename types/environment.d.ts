export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_WEBHOOK_URL: string;
    }
  }
}