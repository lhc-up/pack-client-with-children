const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const log = require('./log.js');
function reDownloadElectronBuilderForLoongArc(projectFolder) {
    log.title('重新下载electron-builder：');
    fse.removeSync(path.join(projectFolder, 'node_modules/electron-builder'));
    fse.removeSync(path.join(projectFolder, 'node_modules/builder-util'));
    fse.removeSync(path.join(projectFolder, 'package-lock.json'));
    shell.cd(projectFolder);
    shell.exec('npm i electron-builder@24.13.3 -D --registry=https://registry.loongnix.cn:4873/')
}

module.exports = {
    reDownloadElectronBuilderForLoongArc,
}