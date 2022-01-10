#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const excel = require('./src/langToJs');
const water = require('./src/waterMark');
const getLang = require('./src/getChinese');

//解析xlsx为多语言js文件
program.command('xlsx')
    .description('必须cd到box_client/uni-app下执行命令，将box_cfg下对应版本目录lang.xlsx解析为多语言js文件')
    .action(() => {
        excel.doAction();
    })

//给图片加水印
program.command('water')
    .description('给图片加水印')
    .action(() => {
        water.doAction();
    })

// 中文收集并生成key对应中文的json文件  i18n-cli getlang uni-app -f zh.json -d pages,components
program.command('getlang')
    .description('对当前目录下的 .js .vue .json .php文件进行中文收集，默认当前目录下面所有文件\n')
    .option('-f, --filename <filename>', '[optional]设置生成的文件名，默认为 zh_cn.json，需为 .json 文件\n')
    .option('-d, --ignoredir <ignoredir>', '[optional]需要收集中文的文件夹，默认当前文件夹所有文件', value => {
        return value.split(',')
    })
    .action(({filename = 'zh_cn.json', ignoredir}) => {
        getLang.doAction(filename, ignoredir);
    });

program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
if (process.argv.length === 2) {
    program.help();
}
program.parse(process.argv);
