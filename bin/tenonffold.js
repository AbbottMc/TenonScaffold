#! /usr/bin/env node

const {resolve} = require('path')
const program = require('commander')
const commands = require(resolve(__dirname, '../dist/index.js'))
const {version} = require(resolve(__dirname, '../package.json'))
const Metalsmith = require('metalsmith')
const layouts = require('@metalsmith/layouts')
const prompt = require('inquirer').prompt
const {getTemplateVersionListStr, templateVersions} = require('./TemplateVersions.js');

const guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const initPackCommand = program
  .createCommand()
  .version(version)
  .usage('<command> [options]')
  .command(`init <项目名称>`)
  .description('初始化Minecraft脚本接口项目')
  .option('--native', '原生Minecraft项目（默认选项）')
  .option('--tenon', '基于榫框架的Minecraft项目(目前暂时无用)');


initPackCommand
  .action(() => {
    prompt([
      {
        type: 'input',
        name: 'templateVersion',
        message: `现有的可选模板：\n${getTemplateVersionListStr()}\n请选择需要创建的模板版本(输入对应序号数字即可)：`,
        default: 1
      },
      /*{
        type: 'input',
        name: 'project_id',
        message: '请输入项目id'
      },*/
      {
        type: 'input',
        name: 'packName',
        message: '请输入包名称：'
      },
      {
        type: 'input',
        name: 'packDescription',
        message: '请输入包描述文本：'
      },
      {
        type: 'input',
        name: 'packVersion',
        message: '请输入包版本：',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'authors',
        message: '请输入作者名称：'
      }
    ]).then((answers) => {
      if (answers.packVersion > templateVersions.size) {
        console.error('模板版本不存在');
        process.exit();
      }
      answers.headerUUID = guid();
      answers.behaviorModuleUUID = guid();
      answers.scriptModuleUUID = guid();
      answers.packVersion = answers.packVersion.split('.');
      answers.authors = `${answers.authors}`;
      commands.initPack(initPackCommand.args[1], answers);
    });
  });


initPackCommand.parse(process.argv);

if (initPackCommand.args.length < 1) {
  initPackCommand.help();
}
