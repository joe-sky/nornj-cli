'use strict'

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');

module.exports = () => {
    co(function *() {
        let tmplName = yield prompt('Template Name: ');
        let projectName = yield prompt('Project Name: ');
        let gitUrl;
        let branch;
        if(!config[tmplName]){
            console.log(chalk.red('\n x Template does not exist!'));
            process.exit();
        }
        gitUrl = config[tmplName].url;
        branch = config[tmplName].branch;

        let cmd = `git clone ${gitUrl} ${projectName} --progress && cd ${projectName} && git checkout ${branch}`
        let cmdClone = `git clone ${gitUrl} ${projectName}`;
        let cmdCheckout = `cd ${projectName} && git checkout ${branch}`;
        let spinner = ora('downloading...')
        spinner.start();

        // git.clone(gitUrl, projectName, (repo) => {

        //     if(!repo){
        //         process.exit();
        //     }

        //     repo.exec('checkout', branch, function(){
        //         console.log(chalk.green('\n √ Finished!'));
        //         console.log(`\n cd ${projectName} && npm install \n`);
        //         process.exit();
        //     });

        // })

        //git clone
        exec(cmd, (error, stdout, stderr) => {
            spinner.stop();
            if (error) {
                console.log(error)
                process.exit()
            }
            console.log(chalk.green('\n √ download finished!'));

            //npm install
            exec(`cd ${projectName} && npm install`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error)
                    process.exit()
                }   
                console.log(chalk.green('\n √ competed!'));
                process.exit()
            })
        })
    })
};

