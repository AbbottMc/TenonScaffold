import * as path from 'path'
import Metalsmith from 'metalsmith';
import {exec} from 'child_process';
// @ts-ignore
import inquirer from 'inquirer';
import Handlebars from 'handlebars';
import {sync} from 'rimraf'

// @ts-ignore
import download from 'download-git-repo';

const templateVersions = require('../bin/TemplateVersions.js').templateVersions;

const handleError = function (error: unknown) {
  if (!error) return false;
  console.log(error);
  process.exit();
}

const cloneTemplate = function (projectPath: string, templateVersion: string, callback: () => void) {
  const repo = 'AbbottMc/BedrockScriptTemplates';
  const branch = templateVersion;

  // const cmdStr = `git clone -b ${branch} ${repoURL} ${projectPath}`;

  console.log('开始克隆模板...');

  download(`${repo}#${branch}`, path.resolve(__dirname, projectPath), function (error: unknown) {
    handleError(error);
    console.log(`√ 模板克隆成功`);
    callback();
  })
};

export const initPack = (projectName: string, metadata: object) => {

  const projectPath = path.resolve(process.cwd(), 'tm_' + projectName);

  const callback = function () {
    Metalsmith(projectPath).metadata(metadata).source('.')
      .destination('../' + projectName + "/")
      .use((files, metalsmith, done) => {
        Object.keys(files).forEach(fileName => { // 遍历替换模板
          if (fileName.endsWith('.json') || fileName.endsWith('.js')) {
            const fileContentsString = files[fileName].contents.toString() //Handlebar compile 前需要转换为字符创
            files[fileName].contents = Buffer.from(Handlebars.compile(fileContentsString)(metalsmith.metadata()));
          }
        });
        done(null, files, metalsmith);
      }).build(function (err) {
      sync(projectPath);
      handleError(err);
      console.log(`安装node模块...`);
      exec('npm i', {cwd: `./${projectName}/`}, (error) => {
        handleError(error);
        console.log(`√ 项目初始化成功`);
      });
    });
  };

  // @ts-ignore
  cloneTemplate(projectPath, templateVersions.get(Array.from(templateVersions.keys())[parseInt(metadata.templateVersion) - 1]), callback);
}