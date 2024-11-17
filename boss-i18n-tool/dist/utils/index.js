import fs from "node:fs";
import path from "node:path";
export function getCWD() {
    return process.cwd();
}
// 递归获取当前文件夹下所有文件
export function getFiles(dir, result = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            getFiles(filePath, result);
        }
        else {
            result.push(filePath);
        }
    });
    return result;
}
//# sourceMappingURL=index.js.map