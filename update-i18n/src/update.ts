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

function getAllJSONFiles(path: string) {
  const files = fs.readdirSync(path);
  return files.filter((file) => file.endsWith(".json") && file !== "keys.json");
}

function choseUpdateFile(files: string[]): Promise<string> {
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
        resolve(answers.file as string);
      });
  });
}

function getJSONByFile(file: string, dir: string) {
  return JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
}

function checkUpdate(file: string, source: string, target: string) {
  const zhCN = getJSONByFile("zh-cn.json", target);
  const sourceJSON = getJSONByFile(file, source);
  const targetJSON = getJSONByFile(file, target);

  // targetJSON 对比 sourceJSON, 有哪些key修改，哪些key新增，哪些key删除
  const addKeys = Object.keys(targetJSON).filter((key) => !sourceJSON[key]);
  const deleteKeys = Object.keys(sourceJSON).filter((key) => !targetJSON[key]);
  const updateKeys = Object.keys(sourceJSON).filter(
    (key) => targetJSON[key] !== sourceJSON[key]
  );

  // print
  console.log(`${file},============================`);
  console.log(chalk.green("新增: "), addKeys?.length);
  console.log(chalk.red("删除: "), deleteKeys?.length);
  console.log(chalk.yellow("修改: "), updateKeys?.length);

  const deleteKeysCompareWithZhCN = Object.keys(zhCN).filter(
    (key) => !targetJSON[key]
  );
  setTimeout(() => {
    if (deleteKeysCompareWithZhCN.length > 0) {
      console.log(chalk.red(`===========================`));
      console.log(
        chalk.red(`${file},更新文档key少于zh-cn.json`),
        deleteKeysCompareWithZhCN?.length
      );
      console.log(chalk.red(`===========================`));
    } else {
      console.log(chalk.green(`${file},更新完成`));
    }
  });
}

function updateJSONFile(options: { file: string, source: string, target: string, onlyValue?: boolean }) {
  const { file, source, target, onlyValue=false } = options;
  // source 文件覆盖 target 文件
  const sourceJSON = getJSONByFile(file, source);
  const targetJSON = getJSONByFile(file, target);
  checkUpdate(file, source, target);
  let newValue = sourceJSON;
  if (onlyValue) {
    newValue = Object.keys(targetJSON).reduce((acc: any, key: string) => {
      acc[key] = sourceJSON[key];
      return acc;
    }, {});
  } 
  writeToFile(path.join(target, file), newValue);
}

function writeToFile(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function updateProject(dir: string) {
  //   const branch = execSync("git branch --show-current", { cwd: dir });
  execSync(`git checkout main`, { cwd: dir });
  execSync(`git pull`, { cwd: dir });
  //   execSync(`git checkout ${branch}`, { cwd: dir });
  console.log(chalk.green(`${dir} 更新完成`));
}

export async function updateI18n(options: { onlyValue: boolean }) {
  const project = await choseProject();
  const projectInfo = ProjectList.find((item) => item.name === project);
  if (!projectInfo) {
    console.log(chalk.red("项目不存在"));
    return;
  }

  const targetJSONList = getAllJSONFiles(projectInfo.target);
  console.log(targetJSONList);
  const choseFile = await choseUpdateFile(targetJSONList);
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
  } else if (choseFile) {
    updateJSONFile({
      file: choseFile,
      source: projectInfo.source,
      target: projectInfo.target,
      onlyValue: options.onlyValue
    });
  }
}
