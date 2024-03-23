import { myApi } from "./preload";
declare global {
  interface Window {
    myApi: typeof myApi;
  }
}