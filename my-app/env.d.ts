/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_SOME_KEY: string
  readonly VITE_ANKI_DEFAULT_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
