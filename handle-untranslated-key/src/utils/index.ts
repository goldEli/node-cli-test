// read all file by path
import { execSync } from "child_process";
import fs from "fs";

export const readAllFileByPath = (path: string) => {
  const files = fs.readdirSync(path);
  return files;
};

// git checkout main and pull
export const gitCheckoutMainAndPull = (path: string) => {
  const command = `cd ${path} && git checkout main && git pull`;
  execSync(command);
};

// read json by path
export const readJSONByPath = (path: string) => {
  const content = fs.readFileSync(path, "utf8");
  return JSON.parse(content);
};

// check obj not empty like {}
export const isEmptyObject = (obj: Record<string, string>) => {
  return Object.keys(obj).length === 0;
};


// write json by path
export const writeJSONByPath = (path: string, obj: Record<string, string>) => {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));
};

// create dir by path if not exist , remove dir by path if exist
export const createDirByPath = (path: string) => {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true });
  }
  fs.mkdirSync(path, { recursive: true });
};

