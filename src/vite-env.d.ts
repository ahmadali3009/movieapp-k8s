/// <reference types="vite/client" />

// Type declaration for runtime environment variables injected by env.sh script
interface Window {
  env?: {
    API_URL?: string;
    APP_ENV?: string;
    [key: string]: string | undefined;
  };
}