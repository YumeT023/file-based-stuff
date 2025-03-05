import fs from "fs";
import path from "path";

export const getProjectRoot = () => {
  let root = ".";
  while (true) {
    const contents = fs.readdirSync(root);
    if (contents.includes("package.json")) {
      break;
    }
    root = path.join("../", root);
  }
  return root;
}
