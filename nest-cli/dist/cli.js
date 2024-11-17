#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transformFile } from "./transform.js";
import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { Command } from 'commander';
import chalk from "chalk";
const program = new Command();
program
    .name('my-nest-cli')
    .description('自动添加 controller')
    .version('0.0.1');
program.command('transform')
    .description('修改 module 代码，添加 controller')
    .argument('path', '待转换的文件路径')
    .action((filePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!filePath) {
        console.log(chalk.red('文件路径不能为空'));
    }
    const p = path.join(process.cwd(), filePath);
    try {
        yield access(p);
        const formattedCode = yield transformFile(filePath);
        writeFile(p, formattedCode);
        console.log(`${chalk.bgBlueBright('UPDATE')} ${filePath}`);
    }
    catch (e) {
        console.log(chalk.red('文件路径不存在'));
    }
}));
program.parse();
//# sourceMappingURL=cli.js.map