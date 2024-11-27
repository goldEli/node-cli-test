#! /usr/bin/env node

import inquirer from "inquirer";
import { projectList } from "./config.js";
import { createDirByPath, gitCheckoutMainAndPull, isEmptyObject, readAllFileByPath, readJSONByPath, writeJSONByPath } from "./utils/index.js";
import path from "path";

const resultPath = path.join(process.cwd(), "result");

createDirByPath(resultPath);

// select project
async function selectProject() {
  // 定义选项
  const choices = projectList.map((project) => ({
    name: project.name,
    value: project.name,
  }));

  // 使用 Inquirer.js 显示多选列表
  const answers = await inquirer.prompt([
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

function getNameByPath(path: string) {
  return path.split("/").pop()?.split(".")[0];
}

function filterFilesWithJSON(files: string[]) {
  return files.filter((file) => file.endsWith(".json"));
}

async function handleProject(projectName: string) {

  const outputDir = path.join(resultPath, projectName);
  // create dir by path if not exist
  createDirByPath(outputDir);
  const project = projectList.find((project) => project.name === projectName);
  const projectPath = project?.path;
  if (!projectPath) {
    console.error(`项目 ${projectName} 不存在`);
    return;
  }
  gitCheckoutMainAndPull(projectPath);
  const allFiles = readAllFileByPath(projectPath);
  const files = filterFilesWithJSON(allFiles);
  const { zh, en } = project;
  // console.log(files);
  const sourceFiles = files.filter((file) => ![zh, en].includes(file));

  console.log(123,sourceFiles, zh, en);

  for (const file of sourceFiles) {
    const name = getNameByPath(file);
    const zhContent = readJSONByPath(path.join(projectPath, zh));
    const enContent = readJSONByPath(path.join(projectPath, en));
    const sourceContent = readJSONByPath(path.join(projectPath, file));
    const result: Record<string, string> = {};

    for (const key in zhContent) {
      if (!sourceContent[key]) {
        result[key] = enContent[key] || "";
      }
    }
    if (isEmptyObject(result)) {
      console.log(`${name} 没有未翻译的key`);
      continue;
    }
    writeJSONByPath(path.join(outputDir, file), result);
  }
  console.log(`${projectName} 处理完成`);
}

async function main() {
  const selectedProject = await selectProject();

  for (const projectName of selectedProject) {
    handleProject(projectName);
  }
}

main();
