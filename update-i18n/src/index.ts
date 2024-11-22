// #!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
// @ts-ignore
import Alphabet from "alphabetjs";
import { updateI18n } from "./update.js";


const program = new Command();


program.name("update-i18n").description("更新国际化").version("0.0.1");

console.log(chalk.green(Alphabet("UPDATE I18N", 'planar')));


program
  .option('-ov, --onlyValue', 'Only update values, not keys', false)
  .action(async (options) => {
    const { onlyValue = false } = options;
    console.log(options);
    updateI18n({
      onlyValue
    });
  });

program.parse();


