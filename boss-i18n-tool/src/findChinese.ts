import { getFiles } from "./utils/index.js";


export function findChinese(filePath: string) {

}

// 处理文件中的中文
export function handleChinese(filePath: string) {
    const files = getFiles(filePath);
    console.log(files);

}