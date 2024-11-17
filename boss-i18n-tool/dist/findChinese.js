import fs from "fs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { getFiles, isContainChinese } from "./utils/index.js";
import path from "path";
import chalk from "chalk";
import { HTMLParser } from "./utils/HTMLParser.js";
const htmlParser = new HTMLParser();
export function getHtmlContent(str, filePath) {
    var _a, _b;
    // reverse
    const reverseStr = str.split("").reverse().join("");
    let index = 0;
    let endIndex = 0;
    let startIndex = 0;
    let isReady = false;
    let token = reverseStr[index];
    const stack = [];
    while (token) {
        if (token === "}") {
            const siblingToken = reverseStr[index + 1];
            if (siblingToken === "@") {
                startIndex = index + 2;
                index += 2;
                isReady = true;
                continue;
            }
        }
        if (token === "}") {
            stack.push(token);
        }
        if (token === "{") {
            if (stack.length === 0) {
                console.log(chalk.red(`
                    ${filePath}有语法错误❌\n
                    在${index}位置\n
                    `));
                break;
            }
            // 数组随后已移除
            stack.pop();
            if (isReady && stack.length === 0) {
                endIndex = index;
                break;
            }
        }
        // update
        ++index;
        token = reverseStr[index];
    }
    const ret = (_b = (_a = reverseStr.slice(startIndex, endIndex)) === null || _a === void 0 ? void 0 : _a.split("").reverse().join("")) !== null && _b !== void 0 ? _b : "";
    return ret;
}
export function jsToAst(jsContent) {
    const ast = parser.parse(jsContent, {
        sourceType: "module",
        // plugins: ['jsx']
    });
    return ast;
}
function traverseHTMLAstStringWithChinese(node, result = []) {
    if (!node) {
        return result;
    }
    if (node.type === "text") {
        if (isContainChinese(node.value)) {
            result.push(node.value);
        }
    }
    if (node.type === "element") {
        node.children.forEach((child) => {
            traverseHTMLAstStringWithChinese(child, result);
        });
    }
    return result;
}
function htmlToAst(htmlContent) {
    const ast = htmlParser.parse(htmlContent);
    return ast;
}
export function findChineseInHtml(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const htmlContent = getHtmlContent(content, filePath);
    if (!htmlContent) {
        return;
    }
    const ast = htmlToAst(htmlContent);
    const chineseList = traverseHTMLAstStringWithChinese(ast);
    const result = {};
    chineseList.forEach((chinese) => {
        const key = getKey(filePath, chinese);
        result[key] = chinese;
    });
    return result;
}
function getRandomKey() {
    return `random_key_${Math.random().toString(36).substring(2, 15)}`;
}
function getKeyPrefixByFilePath(filePath) {
    const keys = filePath.split("/").slice(1);
    let keyPrefix = "";
    let index = keys.length - 1;
    while (keys[index]) {
        keyPrefix = keys[index];
        if (index === keys.length - 2) {
            break;
        }
        index--;
    }
    return keyPrefix;
}
function getKey(filePath, value) {
    const keyPrefix = getKeyPrefixByFilePath(filePath);
    if (["if", "{", "}", "<", ">"].some((item) => value.includes(item))) {
        return `${keyPrefix}.${getRandomKey()}`;
    }
    return `${keyPrefix}.${value}`;
}
export function findChineseInJs(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    if (!isContainChinese(content)) {
        return;
    }
    const ast = jsToAst(content);
    // 遍历ast 找到StringLiteral节点
    const chineseList = [];
    const res = {};
    traverse.default(ast, {
        StringLiteral(path) {
            if (isContainChinese(path.node.value)) {
                const key = getKey(filePath, path.node.value);
                chineseList.push(path.node.value);
                res[key] = path.node.value;
            }
        },
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
        if (file.endsWith(".js")) {
            const res = findChineseInJs(file);
            Object.assign(result, res);
        }
        // xxxx.html
        if (file.endsWith(".html")) {
            const res = findChineseInHtml(file);
            Object.assign(result, res);
        }
    }
    writeZhCnJson(result, dirPath);
}
// write zh_cn.json
export function writeZhCnJson(result, dirPath) {
    fs.writeFileSync(path.resolve(dirPath, "zh_cn.json"), JSON.stringify(result, null, 2));
}
//# sourceMappingURL=findChinese.js.map