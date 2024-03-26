/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANKI_DEFAULT_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
