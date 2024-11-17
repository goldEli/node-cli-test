import fs from 'fs';
import parser from '@babel/parser';
import traverse from "@babel/traverse";
import { getFiles, isContainChinese } from "./utils/index.js";
import path from 'path';
export function jsToAst(jsContent) {
    const ast = parser.parse(jsContent, {
        sourceType: 'module',
        // plugins: ['jsx']
    });
    return ast;
}
export function findChineseInJs(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!isContainChinese(content)) {
        return;
    }
    const ast = jsToAst(content);
    // 遍历ast 找到StringLiteral节点
    const chineseList = [];
    const res = {};
    // 获取文件路径的key,数组到第二个
    const keys = filePath.split('/').slice(1);
    let keyPrefix = '';
    let index = keys.length - 1;
    while (keys[index]) {
        keyPrefix = keys[index];
        if (index === keys.length - 2) {
            break;
        }
        index--;
    }
    traverse.default(ast, {
        StringLiteral(path) {
            var _a;
            if (isContainChinese(path.node.value)) {
                const nameForKey = (_a = path.node.value) === null || _a === void 0 ? void 0 : _a.trim();
                const key = `${keyPrefix}.${nameForKey}`;
                chineseList.push(path.node.value);
                res[key] = path.node.value;
            }
        }
    });
    return res;
}
// 处理文件中的中文
export function handleChinese(dirPath) {
    const files = getFiles(dirPath);
    // console.log(files);
    const result = {};
    for (const file of files) {
        // xxxx.js
        if (file.endsWith('.js')) {
            const res = findChineseInJs(file);
            Object.assign(result, res);
        }
    }
    writeZhCnJson(result, dirPath);
}
// write zh_cn.json 
export function writeZhCnJson(result, dirPath) {
    fs.writeFileSync(path.resolve(dirPath, 'zh_cn.json'), JSON.stringify(result, null, 2));
}
//# sourceMappingURL=findChinese.js.map