#!/usr/bin/env node
// import { transformFile } from "./transform.js";
import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { Command } from 'commander';
import chalk from "chalk";
import { getCWD } from "./utils/index.js";
import { handleChinese } from "./findChinese.js";

const program = new Command();

program
  .name('boss-i18n-tool')
  .description('boss 国际化工具')
  .version('0.0.1');

program.command('f')
  .description('查找中文')
  .argument('path', '待转换的文件路径')
  .action(async (filePath: string) => {
    if(!filePath) {
        console.log(chalk.red('文件路径不能为空'));
        return;
    }

    const cwd = getCWD();
    console.log(chalk.green(`当前工作目录: ${cwd}`));
    console.log(chalk.green(`待处理的文件路径: ${filePath}`));

    handleChinese(filePath);

  });

program.parse();
