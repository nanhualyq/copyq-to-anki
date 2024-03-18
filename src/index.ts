process.env.NODE_ENV = process.env.NODE_ENV || "production";

import "./modules/logger";
import { show } from "./modules/menu.ts";
show();
