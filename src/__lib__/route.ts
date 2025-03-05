import fs from "fs";
import p from "path";
import {resolveConfig} from "./config";
import {getProjectRoot} from "./fs_util";
import {stripSuffix} from "./str_util";

const ROUTE_PATH = p.resolve(getProjectRoot(), resolveConfig().routeDir!);

export enum HttpMethod {
  GET = "get", POST = "post", PUT = "put", PATCH = "patch", DELETE = "delete", OPTIONS = "options",
}

export type Route = { path: string } & {
  [Key in keyof typeof HttpMethod]?: () => any;
}

export const getRoutes = (): Route[] => {
  const routeEntries = fs.readdirSync(ROUTE_PATH);
  return routeEntries
    .flatMap(route => buildRoutes(p.join(ROUTE_PATH, route)))
    .filter((route): route is Route => route != null)
}

const buildRoutes = (path: string): Route | (Route | null)[] | null => {
  const entry = fs.statSync(path);
  if (entry.isFile()) {
    const {dir, name} = p.parse(p.relative(ROUTE_PATH, path));

    const prefix = dir ? `/${dir}` : dir;
    const tail = name === "index" ? "/" : name;
    const routePath = `${prefix}/${tail}`.replace(/\\+/g, "/").replace(/\/+/g, "/");

    const routeModule = require(path);
    const routeHandlers = getRouteHandlers(routeModule, path)

    return {
      path: convertToEjsPathVariableSyntax(stripSuffix(routePath, "/")), ...routeHandlers
    }
  }
  if (entry.isDirectory()) {
    const entries = fs.readdirSync(path);
    return entries.flatMap(entry => buildRoutes(p.join(path, entry)))
  }
  throw new Error("Invalid path: " + path);
}

const getRouteHandlers = (mod: Record<string, any>, path: string) => {
  const httpMethodKeys = Object.keys(mod).filter((key): key is HttpMethod => key in HttpMethod);
  if (!httpMethodKeys.length && !mod.default) {
    throw new Error(`Missing route handler for '${path}'`)
  }

  const routeHandlers = {} as Record<typeof HttpMethod[keyof typeof HttpMethod], Function | undefined>;

  for (const key of httpMethodKeys) {
    if (typeof mod[key] !== "function") {
      throw new Error(`Invalid route handler for '${key}'`)
    }

    // lol
    const lowKey = HttpMethod[key as string as keyof typeof HttpMethod];
    routeHandlers[lowKey] = mod[key];
  }

  if (!routeHandlers.get && mod.default) {
    if (typeof mod.default !== "function") {
      throw new Error(`Invalid route handler for 'get'`);
    }
    routeHandlers.get = mod.default;
  }

  return routeHandlers
}

// [id] => :id
const convertToEjsPathVariableSyntax = (path: string) => {
  return path
    .replace(/\[(\w+)]*/g, (_s, match) => `:${match}`)
}
