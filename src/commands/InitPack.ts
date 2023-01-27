import * as path from 'path'
import Metalsmith from 'metalsmith';
import {exec} from 'child_process';
// @ts-ignore
import inquirer from 'inquirer';
import Handlebars from 'handlebars';
import {sync} from 'rimraf'

const templateVersions = require('../bin/TemplateVersions.js').templateVersions;

const handleError = function (error: unknown) {
  if (!error) return false;
  console.log(error);
  process.exit();
}

const cloneTemplate = function (projectPath: string, templateVersion: string, callback: () => void) {
  const repoURL = 'https://github.com/AbbottMc/BedrockScriptTemplates';
  const branch = templateVersion;

  const cmdStr = `git clone -b ${branch} ${repoURL} ${projectPath}`;

  console.log('\n start clone template...');

  exec(cmdStr, (error) => {
    handleError(error);
    console.log(`\n √ 模板克隆成功`);
    callback();
  });
};

export const initPack = (projectName: string, metadata: object) => {

  const projectPath = path.resolve(process.cwd(), 'tm_' + projectName);

  const callback = function () {
    Metalsmith(projectPath).metadata(metadata).source('.')
      .destination('../' + projectName + "/")
      .use((files, metalsmith, done) => {
        Object.keys(files).forEach(fileName => { // 遍历替换模板
          if (fileName.endsWith('.json') || fileName.endsWith('.js')) {
            console.log(fileName);
            const fileContentsString = files[fileName].contents.toString() //Handlebar compile 前需要转换为字符创
            files[fileName].contents = Buffer.from(Handlebars.compile(fileContentsString)(metalsmith.metadata()));
          }
        });
        done(null, files, metalsmith);
      }).build(function (err) {
      sync(projectPath);
      handleError(err);
      exec('npm i', {cwd: `./${projectName}/`}, (error) => {
        handleError(error);
        console.log(`\n √ 项目初始化成功`);
      });
    });
  };

  // @ts-ignore
  cloneTemplate(projectPath, templateVersions.get(Array.from(templateVersions.keys())[parseInt(metadata.templateVersion) - 1]), callback);
}