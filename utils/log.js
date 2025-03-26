const chalk = require('chalk');

const log = {
    info: (...args) => {
        console.log(chalk.blue(...args));
    },
    error: (...args) => {
        console.log(chalk.red(...args));
    },
    warn: (...args) => {
        console.log(chalk.yellow(...args));
    },
    success: (...args) => {
        console.log(chalk.green(...args));
    },
    debug: (...args) => {
        console.log(chalk.blue(...args));
    },
    title: (...args) => {
        console.log(`\n${chalk.bold.cyan(...args)}\n`);
    },
};


module.exports = log;