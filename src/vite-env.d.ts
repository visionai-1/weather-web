/// <reference types="vite/client" />

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_ALERTS_API_URL: string;
  readonly VITE_TOMORROW_WEATHER_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
