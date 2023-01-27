'use strict';

var path = require('path');
var Metalsmith = require('metalsmith');
var child_process = require('child_process');
var Handlebars = require('handlebars');
var rimraf = require('rimraf');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

const templateVersions = require('../bin/TemplateVersions.js').templateVersions;
const handleError = function (error) {
    if (!error)
        return false;
    console.log(error);
    process.exit();
};
const cloneTemplate = function (projectPath, templateVersion, callback) {
    const repoURL = 'https://github.com/AbbottMc/BedrockScriptTemplates';
    const branch = templateVersion;
    const cmdStr = `git clone -b ${branch} ${repoURL} ${projectPath}`;
    console.log('\n start clone template...');
    child_process.exec(cmdStr, (error) => {
        handleError(error);
        console.log(`\n √ 模板克隆成功`);
        callback();
    });
};
const initPack = (projectName, metadata) => {
    const projectPath = path__namespace.resolve(process.cwd(), 'tm_' + projectName);
    const callback = function () {
        Metalsmith(projectPath).metadata(metadata).source('.')
            .destination('../' + projectName + "/")
            .use((files, metalsmith, done) => {
            Object.keys(files).forEach(fileName => {
                if (fileName.endsWith('.json') || fileName.endsWith('.js')) {
                    console.log(fileName);
                    const fileContentsString = files[fileName].contents.toString(); //Handlebar compile 前需要转换为字符创
                    files[fileName].contents = Buffer.from(Handlebars.compile(fileContentsString)(metalsmith.metadata()));
                }
            });
            done(null, files, metalsmith);
        }).build(function (err) {
            rimraf.sync(projectPath);
            handleError(err);
            child_process.exec('npm i', { cwd: `./${projectName}/bev/scripts/` }, (error) => {
                handleError(error);
                console.log(`\n √ 项目初始化成功`);
            });
        });
    };
    // @ts-ignore
    cloneTemplate(projectPath, templateVersions.get(Array.from(templateVersions.keys())[parseInt(metadata.templateVersion) - 1]), callback);
};

exports.initPack = initPack;
