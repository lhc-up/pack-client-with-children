const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const os = require('os');
const { getChildPkg, getInstaller, formatNow } = require('./utils/utils.js');
const log = require('./utils/log.js');
// const config = require('./config.js');
const config = require('./config.area-bnu.js');
const inquirer = require('inquirer');
const { reDownloadElectronBuilderForLoongArc } = require('./utils/reDownloadNodeModules.js');

const isWin = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';

// TODO:
// 1. 文件夹名称使用客户端标识（或txt文件标明关系）
// 2. 打包时不再打开文件夹
// 3. done 版本号配置
// 4. 界面化？任务编排？和之前的客户端打包项目整合到一起？
// 5. done 打包时二次确认（醒目提示），告知执行者，确认打包后将清空暂存区
// 6. 实际打包日志输出到文件中，控制台中只保留关键点
// 7. done 在此项目中新增一个文件夹比如“project”，将git仓库克隆到此文件夹中，然后执行打包命令
// 8. done 支持设置分支，默认develop
// 9. done 子应用打包好后放入一个文件夹中，然后打包installer，如果是整合包，则创建client文件夹并复制子应用进来
// 10. 支持设置引入哪个子应用(支持设置引入的子应用版本???)
// 11. 支持设置标识？（修改地方太多，项目本身需要可配置）
// 12. done 有version时使用version，没有时不修改version文件
// 13. windows客户端签名以及证书配置？
shell.config.fatal = true;
const task = {
    root: __dirname,
    // 打包结果根目录
    resultRoot: '',
    // 项目存放根目录
    projectRoot: '',
    run() {
        console.time('打包耗时');
        this.initFolder();
    
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
        this.resultRoot = result;
        this.projectRoot = path.join(this.root, 'project');
    },
    packInstaller(installer) {
        const { name, version, targets, branch, children, sign } = installer;
        if (!targets?.length) return;

        this.initGit(name, branch);
        this.initVersion(name, version);
        
        const projectFolder = path.join(this.projectRoot, name);
        // 单个客户端打包结果目录，按客户端标识区分
        const resultFolder = path.join(this.resultRoot, `${name}-${config.env}-${version}`);
        fse.ensureDirSync(resultFolder);
        // 打包子应用并copy到client文件夹
        const appList = [];
        if (children?.length) {
            const clientFolder = path.join(projectFolder, 'client');
            fse.ensureDirSync(clientFolder);
            fse.emptyDirSync(clientFolder);
            for (const child of children) {
                const { childParams } = this.packChild(child, clientFolder, resultFolder);
                appList.push(childParams);
            }
        }
        
        // 客户端批量上传参数
        const batchParams = [];
        const pkgJson = fse.readJsonSync(path.join(projectFolder, 'package.json'));
        shell.cd(projectFolder);
        shell.exec('npm i');
        const hasLoong64 = targets.includes('linux-loong64');
        if (hasLoong64) {
            reDownloadElectronBuilderForLoongArc(projectFolder);
        }
        for (const target of targets) {
            log.title(`开始打包${name}-${version}-${target}：`);
            let packCmd = `npm run pack:${target} ${config.env}`;
            if (sign && isWin && target.includes('win')) {
                packCmd += ' sign';
            }
            shell.exec(packCmd);
            const packResult = getInstaller(projectFolder);
            // 大版本文件（安装包）
            fse.copySync(packResult.installer, path.join(resultFolder, path.basename(packResult.installer)));
            // 小版本文件
            fse.copySync(packResult.smallPkg, path.join(resultFolder, path.basename(packResult.smallPkg)));
            // icon
            const iconPath = path.join(projectFolder, 'builderClient/icons/128x128.png');
            fse.copySync(iconPath, path.join(resultFolder, `${pkgJson.name}.png`));
            batchParams.push({
                clientName: pkgJson.appName,
                // win平台使用pkgJson.name，其他平台使用pkgJson.name-target
                identification: `${pkgJson.name}${target.includes('win') ? '' : '-' + target}`,
                copyright: pkgJson.author,
                description: pkgJson.description,
                iconImg: `${pkgJson.name}.png`,
                versionCode: version,
                bigVersionFile: path.basename(packResult.installer),
                smallVersionFile: path.basename(packResult.smallPkg),
                isEncrypt: '0',
                apps: appList,
            });
        }
        // 客户端批量上传参数
        fse.writeFileSync(path.join(resultFolder, 'params.json'), JSON.stringify(batchParams, null, 4));
    },
    packChild(child, clientFolder, resultFolder) {
        const { name, version, branch } = child;
        this.initGit(name, branch);
        this.initVersion(name, version);

        log.title(`开始打包${name}：`);
        const projectFolder = path.join(this.projectRoot, name);
        shell.cd(projectFolder);
        shell.exec('npm i');
        shell.exec(`npm run pack:child ${config.env}`);

        const childPkg = getChildPkg(projectFolder);
        // 子应用复制到client文件夹
        fse.copySync(childPkg, path.join(clientFolder, path.basename(childPkg)));
        // 子应用复制到最终产物文件夹
        fse.copySync(childPkg, path.join(resultFolder, path.basename(childPkg)));

        const pkgJson = fse.readJsonSync(path.join(projectFolder, 'package.json'));
        const iconPath = path.join(projectFolder, 'builderClient/icons/128x128.png');
        // 子应用icon复制到最终产物文件夹
        fse.copySync(iconPath, path.join(resultFolder, `${pkgJson.name}.png`));
        return {
            childPkg,
            iconPath,
            childParams: {
                applicationName: pkgJson.appName,
                identification: pkgJson.name,
                iconImg: `${pkgJson.name}.png`,
                description: pkgJson.description,
                // verison使用配置中的
                versionCode: version,
                versionFile: path.basename(childPkg),
                isEncrypt: '0'
            }
        }
    },
    initGit(projectName, branch) {
        log.title(`初始化${projectName}git仓库：`);
        const folder = path.join(this.projectRoot, projectName);
        shell.cd(folder);
        shell.exec('git checkout .');
        shell.exec(`git checkout ${branch || 'develop'}`);
        shell.exec('git pull');
        log.title('近10条提交记录：');
        shell.exec('git log -n 10 --pretty=format:"%h %ai %an %ce %s"');
    },
    initVersion(projectName, version) {
        // version不存在时，使用项目中配置的version
        if (!version) return;
        const folder = path.join(this.projectRoot, projectName);
        const versionPath = path.join(folder, 'public/version/index.js');
        const code = fse.readFileSync(versionPath).toString();
        const versionObj = eval(code);
        versionObj.version = version.split('.');
        fse.writeFileSync(versionPath, `module.exports = ${JSON.stringify(versionObj, null, 4)}`);
    },
    zip() {
        const folders = fse.readdirSync(this.resultRoot);
        for (const folderName of folders) {
            const zipName = `${folderName}-${formatNow()}.zip`
            log.title(`压缩：${zipName}：`);
            shell.cd(path.join(this.resultRoot, folderName));
            // TODO: 使用压缩程序代替命令，保证各平台一致性？
            if (isWin) {
                shell.exec(`powershell Compress-Archive -Path ./* -DestinationPath ./${zipName}`);
            } else {
                shell.exec(`zip -r ./${zipName} .`);
            }
        }
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