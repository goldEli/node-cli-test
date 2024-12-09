#! /usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import { projectList } from "./config.js";
import { createDirByPath, gitCheckoutMainAndPull, isEmptyObject, readAllFileByPath, readJSONByPath, writeJSONByPath } from "./utils/index.js";
import path from "path";
import chalk from "chalk";
const resultPath = path.join(process.cwd(), "result");
createDirByPath(resultPath);
// select project
function selectProject() {
    return __awaiter(this, void 0, void 0, function* () {
        // 定义选项
        const choices = projectList.map((project) => ({
            name: project.name,
            value: project.name,
        }));
        // 使用 Inquirer.js 显示多选列表
        const answers = yield inquirer.prompt([
            {
                type: "checkbox", // 多选类型
                name: "selectedOptions",
                message: "请选择你想要的选项（按空格选择，回车确认）：",
                choices,
            },
        ]);
        // 打印用户选择的结果
        console.log("你选择了：", answers.selectedOptions);
        return answers.selectedOptions;
    });
}
// select zh language and en language
// async function selectLanguage(list: string[]) {
//   const selectList = list.filter((item) => item.toUpperCase().includes("ZH") || item.toUpperCase().includes("EN"));
//   const answersZh = await inquirer.prompt([
//     {
//       type: "list", //单选
//       name: "selectedOptions",
//       message: "请选择中文",
//       choices: selectList,
//     },
//   ]);
//   const zh = answersZh.selectedOptions;
//   const answersEn = await inquirer.prompt([
//     {
//       type: "list", //单选
//       name: "selectedOptions",
//       message: "请选择英文",
//       choices: selectList,
//     },
//   ]);
//   const en = answersEn.selectedOptions;
//   return { zh, en };
// }
function getNameByPath(path) {
    var _a;
    return (_a = path.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
}
function filterFilesWithJSON(files) {
    return files.filter((file) => file.endsWith(".json"));
}
function isChinese(str) {
    return /[\u4E00-\u9FA5]/.test(str);
}
function handleProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputDir = path.join(resultPath, projectName);
        // create dir by path if not exist
        createDirByPath(outputDir);
        const project = projectList.find((project) => project.name === projectName);
        const projectPath = project === null || project === void 0 ? void 0 : project.path;
        if (!projectPath) {
            console.error(`项目 ${projectName} 不存在`);
            return;
        }
        gitCheckoutMainAndPull(projectPath);
        const allFiles = readAllFileByPath(projectPath);
        const files = filterFilesWithJSON(allFiles);
        const { zh, en } = project;
        // console.log(files);
        const sourceFiles = files.filter((file) => ![zh].includes(file));
        const zhContent = readJSONByPath(path.join(projectPath, zh));
        const enContent = readJSONByPath(path.join(projectPath, en));
        // console.log(sourceFiles, zh, en);
        for (const file of sourceFiles) {
            const name = getNameByPath(file);
            const sourceContent = readJSONByPath(path.join(projectPath, file));
            const result = {};
            for (const key in zhContent) {
                const noTranslate = isChinese(sourceContent[key]) || !sourceContent[key];
                if (!sourceContent[key] && enContent[key]) {
                    result[key] = enContent[key] || "";
                }
            }
            if (isEmptyObject(result)) {
                console.log(`${name} 没有未翻译的key`);
                continue;
            }
            writeJSONByPath(path.join(outputDir, file), result);
        }
        console.log(chalk.green(`${projectName} 处理完成`));
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedProject = yield selectProject();
        for (const projectName of selectedProject) {
            handleProject(projectName);
        }
    });
}
main();
//# sourceMappingURL=index.js.map