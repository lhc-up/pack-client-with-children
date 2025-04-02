const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const { getChildPkg, getInstaller, formatNow } = require('./utils/utils.js');
const log = require('./utils/log.js');
const config = require('./config.js');

const root = path.resolve(__dirname, '..');
const { children, parent, env, targets } = config;

console.time('打包耗时');

const resultFolder = path.join(__dirname, 'result');
const parentFolder = path.join(root, parent);
const clientFolder = path.join(parentFolder, 'client');
fse.ensureDirSync(resultFolder);
fse.emptyDirSync(resultFolder);
fse.ensureDirSync(clientFolder);
fse.emptyDirSync(clientFolder);

shell.config.fatal = true;
// 子应用
for (const c of children) {
    const { name, version } = c;
    const childFolder = path.join(root, name);

    // git
    log.title(`初始化${name}git仓库：`);
    shell.cd(childFolder);
    shell.exec('git checkout .');
    shell.exec('git pull'); 
    log.title('近10条提交记录，作者信息：');
    shell.exec('git log -n 10 --pretty=format:"%h %s %ad"');

    // 写入打包信息
    log.title(`初始化${name}：`);
    // version path
    const versionPath = path.join(childFolder, 'public/version/index.js');
    const code = fse.readFileSync(versionPath).toString();
    const versionObj = eval(code);
    versionObj.version = version.split('.');
    fse.writeFileSync(versionPath, `module.exports = ${JSON.stringify(versionObj, null, 4)}`);

    log.title(`开始打包${name}：`);
    shell.exec('npm i');
    shell.exec(`npm run pack:child ${env}`);
    const childPkg = getChildPkg(path.join(root, name));
    // 子应用复制到整合应用的client文件夹
    fse.copySync(childPkg, path.join(clientFolder, path.basename(childPkg)));
}
// 子应用复制到结果文件夹
fse.copySync(clientFolder, resultFolder);

// 整合包
shell.cd(parentFolder);
shell.exec('git checkout .');
shell.exec('git pull'); 
shell.exec('npm i');
for (const target of targets) {
    shell.exec(`npm run pack:${target} ${env}`);
    const { installer, smallPkg } = getInstaller(parentFolder);
    // 安装包复制到结果目录，文件夹按目标架构区分，避免小版本文件名称冲突
    const folder = path.join(resultFolder, target);
    fse.ensureDirSync(folder);
    fse.copySync(installer, path.join(folder, path.basename(installer)));
    // 小版本文件
    fse.copySync(smallPkg, path.join(folder, path.basename(smallPkg)));
}

const zipName = `安装包-${env}-${formatNow()}.zip`;
log.title(`压缩${zipName}：`);
shell.cd(__dirname);
shell.exec('rm -rf *.zip');
shell.cd(resultFolder);
// mac环境
shell.exec(`zip -r ../${zipName} .`);

console.timeEnd('打包耗时');

// TODO:
// 1. 文件夹名称使用客户端标识（或txt文件标明关系，客户端标识直接写在配置中？）
// 2. 打包时不再打开文件夹
// 3. 版本号配置
// 4. 界面化？任务编排？和之前的客户端打包项目整合到一起？
// 5. 打包时二次确认（醒目提示），告知执行者，确认打包后将清空暂存区
// 6. 实际打包日志输出到文件中，控制台中只保留关键点
// 7. 支持git仓库初始化，配置git地址即可，在此项目中新增一个文件夹比如“project”，将git仓库克隆到此文件夹中，然后执行打包命令
// 8. 支持设置分支