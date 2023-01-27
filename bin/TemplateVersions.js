const TemplateVersions = {
  templateVersions: new Map([
    ['1.19.5x_原生', '1.19.5x_Native'],
    ['1.19.5x_原生_Webpack', '1.19.5x_Native_Webpack']
  ]),
  getTemplateVersionListStr() {
    return Array.from(TemplateVersions.templateVersions.keys()).map((ele, index) => {
      return `[${index + 1}] ` + ele;
    }).join('\n');
  }
};
module.exports = TemplateVersions;