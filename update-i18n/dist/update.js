var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import fs from "fs";
import inquirer from "inquirer";
import { Project, ProjectList } from "./config/project.js";
import path from "path";
import { execSync } from "child_process";
function choseProject() {
    return new Promise((resolve) => {
        inquirer
            .prompt([
            {
                type: "list",
                name: "project",
                message: "请选择项目",
                choices: [Project.WEB, Project.TRADE],
                default: Project.WEB,
            },
        ])
            .then((answers) => {
            resolve(answers.project);
        });
    });
}
function getAllJSONFiles(path) {
    const files = fs.readdirSync(path);
    return files.filter((file) => file.endsWith(".json") && file !== "keys.json");
}
function choseUpdateFile(files) {
    return new Promise((resolve) => {
        inquirer
            .prompt([
            {
                type: "list",
                name: "file",
                message: "请选择更新文件",
                choices: ["all", ...files],
                default: "all",
            },
        ])
            .then((answers) => {
            resolve(answers.file);
        });
    });
}
function getJSONByFile(file, dir) {
    return JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
}
function checkUpdate(file, source, target) {
    const zhCN = getJSONByFile("zh-cn.json", target);
    const sourceJSON = getJSONByFile(file, source);
    const targetJSON = getJSONByFile(file, target);
    // targetJSON 对比 sourceJSON, 有哪些key修改，哪些key新增，哪些key删除
    const addKeys = Object.keys(sourceJSON).filter((key) => !targetJSON[key]);
    const deleteKeys = Object.keys(targetJSON).filter((key) => !sourceJSON[key]);
    const updateKeys = Object.keys(sourceJSON).filter((key) => targetJSON[key] !== sourceJSON[key]);
    // print
    console.log(`${file},============================`);
    console.log(chalk.green("新增: "), addKeys === null || addKeys === void 0 ? void 0 : addKeys.length);
    console.log(chalk.red("删除: "), deleteKeys === null || deleteKeys === void 0 ? void 0 : deleteKeys.length);
    console.log(chalk.yellow("修改: "), updateKeys === null || updateKeys === void 0 ? void 0 : updateKeys.length);
    const deleteKeysCompareWithZhCN = Object.keys(zhCN).filter((key) => !targetJSON[key]);
    // setTimeout(() => {
    //   if (deleteKeysCompareWithZhCN.length > 0) {
    //     console.log(chalk.red(`===========================`));
    //     console.log(
    //       chalk.red(`${file},更新文档key少于zh-cn.json`),
    //       deleteKeysCompareWithZhCN?.length
    //     );
    //     console.log(chalk.red(`===========================`));
    //   } else {
    //     console.log(chalk.green(`${file},更新完成`));
    //   }
    // });
}
function updateJSONFile(options) {
    const { file, source, target, onlyValue = false } = options;
    // source 文件覆盖 target 文件
    const sourceJSON = getJSONByFile(file, source);
    const targetJSON = getJSONByFile(file, target);
    checkUpdate(file, source, target);
    let newValue = sourceJSON;
    if (onlyValue) {
        newValue = Object.keys(targetJSON).reduce((acc, key) => {
            acc[key] = sourceJSON[key];
            return acc;
        }, {});
    }
    // remove target file
    fs.rmSync(path.join(target, file), { recursive: true, force: true });
    // copy target file to source and rename
    fs.copyFileSync(path.join(source, file), path.join(target, file));
    // writeToFile(path.join(target, file), newValue);
}
function writeToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
function updateProject(dir) {
    //   const branch = execSync("git branch --show-current", { cwd: dir });
    execSync(`git checkout main`, { cwd: dir });
    execSync(`git pull`, { cwd: dir });
    //   execSync(`git checkout ${branch}`, { cwd: dir });
    console.log(chalk.green(`${dir} 更新完成`));
}
export function updateI18n(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield choseProject();
        const projectInfo = ProjectList.find((item) => item.name === project);
        if (!projectInfo) {
            console.log(chalk.red("项目不存在"));
            return;
        }
        const targetJSONList = getAllJSONFiles(projectInfo.target);
        console.log(targetJSONList);
        const choseFile = yield choseUpdateFile(targetJSONList);
        console.log(choseFile);
        if (choseFile) {
            updateProject(projectInfo.source);
        }
        if (choseFile === "all") {
            targetJSONList.forEach((file) => {
                updateJSONFile({
                    file,
                    source: projectInfo.source,
                    target: projectInfo.target,
                    onlyValue: options.onlyValue
                });
            });
        }
        else if (choseFile) {
            updateJSONFile({
                file: choseFile,
                source: projectInfo.source,
                target: projectInfo.target,
                onlyValue: options.onlyValue
            });
        }
    });
}
//# sourceMappingURL=update.js.map