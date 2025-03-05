import path from "path"
import fs from "fs"
import {getProjectRoot} from "./fs_util";

export interface Config {
  routeDir: string;
}

export const DEFAULT_CONFIG: Config = {
  routeDir: "./src/routes"
}

export const resolveConfig = (): Config => {
  const configPath = path.resolve(getProjectRoot(), "file-based-config.json");
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, {encoding: "utf-8"}));
  }
  return DEFAULT_CONFIG;
}
