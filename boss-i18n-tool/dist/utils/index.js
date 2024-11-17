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
// 字符串是否包含中文
export function isContainChinese(str) {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    return chineseRegex.test(str);
}
//# sourceMappingURL=index.js.map