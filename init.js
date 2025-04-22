const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
shell.config.fatal = true;

const repos = [
    'git@39.96.31.218:eachina/eachinaclientframe.git',
    'git@39.96.31.218:eachina/eachinaenglishclient.git',
    'git@39.96.31.218:eachina/eachinaMusicClient.git',
    'git@39.96.31.218:eachina/questionnaire-answer-v3.0.git'
];

function init() {
    const projectRoot = path.join(__dirname, 'project');
    fse.ensureDirSync(projectRoot);
    
    for (const repo of repos) {
        shell.cd(projectRoot);
        shell.exec(`git clone ${repo}`);
        const repoName = path.basename(repo, path.extname(repo));
        const projectFolder = path.join(projectRoot, repoName);
        shell.cd(projectFolder);
        shell.exec('git checkout -b develop origin/develop');
        shell.exec('npm i');
    }
}

inquirer.prompt([{
    type: 'confirm',
    name: 'continue',
    message: '请确保只初始化本地project文件夹中不存在的仓库，且本地已配置SSH Key',
}]).then(answers => {
    if (answers['continue']) init();
}).catch(error => {
    console.error(error);
});