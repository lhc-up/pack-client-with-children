const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const { getChildPkg, getInstaller, formatNow } = require('./utils/utils.js');
const log = require('./utils/log.js');
const config = require('./config.js');
const inquirer = require('inquirer');

// TODO:
// 1. 文件夹名称使用客户端标识（或txt文件标明关系，客户端标识直接写在配置中？）
// 2. 打包时不再打开文件夹
// 3. done 版本号配置
// 4. 界面化？任务编排？和之前的客户端打包项目整合到一起？
// 5. done 打包时二次确认（醒目提示），告知执行者，确认打包后将清空暂存区
// 6. 实际打包日志输出到文件中，控制台中只保留关键点
// 7. done 在此项目中新增一个文件夹比如“project”，将git仓库克隆到此文件夹中，然后执行打包命令
// 8. done 支持设置分支，默认develop
// 9. 子应用打包好后放入一个文件夹中，然后打包installer，如果是整合包，则创建client文件夹并复制子应用进来
// 10. 支持设置引入哪个子应用(支持设置引入的子应用版本???)
// 11. 支持设置标识？（修改地方太多，项目本身需要可配置）
shell.config.fatal = true;
const task = {
    root: __dirname,
    // 打包结果存放目录
    resultFolder: '',
    // 子应用打包结果存放目录
    childResultFolder: '',
    // 项目存放目录
    projectFolder: '',
    run() {
        console.time('打包耗时');
        this.initFolder();
        
        const children = config.children || [];
        for (const child of children) {
            this.packChild(child);
        }

        const installers = config.installers || [];
        for (const installer of installers) {
            this.packInstaller(installer);
        }

        this.zip();

        console.timeEnd('打包耗时');
    },
    initFolder() {
        const result = path.join(this.root, 'result');
        fse.ensureDirSync(result);
        fse.emptyDirSync(result);
        const child = path.join(result, 'child');
        fse.ensureDirSync(child);
        this.resultFolder = result;
        this.childResultFolder = child;
        this.projectFolder = path.join(this.root, 'project');
    },
    packChild(child) {
        const { name, version, branch } = child;
        this.initGit(name, branch);
        this.initVersion(name, version);

        log.title(`开始打包${name}：`);
        const projectFolder = path.join(this.projectFolder, name);
        shell.cd(projectFolder);
        shell.exec('npm i');
        shell.exec(`npm run pack:child ${config.env}`);
        const childPkg = getChildPkg(projectFolder);
        // 子应用复制到result文件夹
        fse.copySync(childPkg, path.join(this.childResultFolder, path.basename(childPkg)));
    },
    packInstaller(installer) {
        const { name, version, targets, branch } = installer;
        if (!targets?.length) return;
        this.initGit(name, branch);
        this.initVersion(name, version);

        const projectFolder = path.join(this.projectFolder, name);
        // 子应用copy进来，后续由配置决定
        fse.copySync(this.childResultFolder, path.join(projectFolder, 'client'));
        
        shell.cd(projectFolder);
        shell.exec('npm i');
        for (const target of targets) {
            log.title(`开始打包${name}-${target}：`);
            shell.exec(`npm run pack:${target} ${config.env}`);
            const result = getInstaller(projectFolder);
            const folder = path.join(this.resultFolder, name, target);
            fse.ensureDirSync(folder);
            fse.copySync(result.installer, path.join(folder, path.basename(result.installer)));
            fse.copySync(result.smallPkg, path.join(folder, path.basename(result.smallPkg)));
        }
    },
    initGit(projectName, branch) {
        log.title(`初始化${projectName}git仓库：`);
        const folder = path.join(this.projectFolder, projectName);
        shell.cd(folder);
        shell.exec('git checkout .');
        shell.exec(`git checkout ${branch || 'develop'}`);
        shell.exec('git pull');
        log.title('近10条提交记录：');
        shell.exec('git log -n 10 --pretty=format:"%h %ai %an %ce %s"');
    },
    initVersion(projectName, version) {
        const folder = path.join(this.projectFolder, projectName);
        const versionPath = path.join(folder, 'public/version/index.js');
        const code = fse.readFileSync(versionPath).toString();
        const versionObj = eval(code);
        versionObj.version = version.split('.');
        fse.writeFileSync(versionPath, `module.exports = ${JSON.stringify(versionObj, null, 4)}`);
    },
    zip() {
        const zipName = `安装包-${config.env}-${formatNow()}.zip`;
        log.title(`压缩${zipName}：`);
        shell.cd(this.root);
        shell.exec('rm -rf *.zip');
        shell.cd(this.resultFolder);
        // mac环境
        shell.exec(`zip -r ../${zipName} .`);
    }
}

inquirer.prompt([{
    type: 'confirm',
    name: 'continue',
    message: '需要打包的项目都在此工程的project目录下，请确保已经和开发仓库做了区分，且打包前会清空未提交的内容，是否继续？',
}]).then(answers => {
    if (answers['continue']) task.run();
}).catch(error => {
    console.error(error);
});