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
// @ts-ignore
import Alphabet from "alphabetjs";
import { updateI18n } from "./update.js";
const program = new Command();
program.name("update-i18n").description("更新国际化").version("0.0.1");
console.log(chalk.green(Alphabet("UPDATE I18N", 'planar')));
program
    .option('-ov, --onlyValue', 'Only update values, not keys', false)
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const { onlyValue = false } = options;
    // console.log(options);
    updateI18n({
        onlyValue
    });
}));
program.parse();
//# sourceMappingURL=index.js.map