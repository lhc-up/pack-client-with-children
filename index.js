const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const { getChildPkg, getInstaller } = require('./utils.js');
const settings = require('./settings.json');

const root = path.resolve(__dirname, '..');
const { children, parent, env, targets } = settings;

const startTime = Date.now();

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
    shell.cd(path.join(root, c));
    shell.exec('git checkout .');
    shell.exec('git pull'); 
    shell.exec('npm i');
    shell.exec(`npm run pack:child ${env}`);
    const childPkg = getChildPkg(path.join(root, c));
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

const endTime = Date.now();
console.log(`打包完成，用时${(endTime - startTime) / 1000}秒`);

// TODO:
// 1. 文件夹名称使用客户端标识（或txt文件标明关系，客户端标识直接写在配置中？）
// 2. 打包时不再打开文件夹
// 3. 版本号配置
// 4. 界面化？任务编排？和之前的客户端打包项目整合到一起？