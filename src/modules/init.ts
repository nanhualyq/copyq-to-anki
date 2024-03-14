if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = process.env.NODE_ENV === "development";
export const DATA_DIR = IS_PROD ? __dirname : process.cwd();
