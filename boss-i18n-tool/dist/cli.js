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
import { Command } from "commander";
import chalk from "chalk";
import { getCWD } from "./utils/index.js";
import { handleChinese } from "./findChinese.js";
const program = new Command();
program.name("boss-i18n-tool").description("boss 国际化工具").version("0.0.1");
program
    .command("f")
    .description("查找中文")
    // 非必填
    .argument("[path]", "待转换的文件路径")
    .action((filePath) => __awaiter(void 0, void 0, void 0, function* () {
    filePath = filePath || getCWD();
    const cwd = getCWD();
    console.log(chalk.green(`当前工作目录: ${cwd}`));
    console.log(chalk.green(`待处理的文件路径: ${filePath}`));
    handleChinese(filePath);
    console.log(chalk.green('处理完成'));
}));
program.parse();
//# sourceMappingURL=cli.js.map