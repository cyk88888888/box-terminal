#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const excel = require('./lib/langToJs')
const xlsxVersion = "0.0.0";// 这里设置项目中xlsx的使用版本

//解析xlsx为多语言js文件
program.command('xlsx')
    .description('将box_cfg下对应版本目录lang.xlsx解析位多语言js文件')
    .action(() => {
        let xlsxRoot = process.cwd().split("box_client")[0] + "box_cfg" + path.sep + xlsxVersion + path.sep + "lang";
        fs.access(xlsxRoot, (err) => {
            if (err) {
                console.error(`${xlsxRoot}目录不存在`);
                process.exit();
            } else {
                excel.tojs(xlsxRoot, (err) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log('finish!')
                    }
                })
            }
        });
    })

//给图片加水印
program.command('water')
    .description('给图片加水印')
    .action(() => {
        console.log(11111111111);
    })


program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
if (process.argv.length === 2) {
    program.help();
}

program.parse(process.argv);
