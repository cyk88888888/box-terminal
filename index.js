#!/usr/bin/env node

const program = require('commander');
const UT = require('./lib/UT');
const TimeUT = require('./lib/TimeUT');
const excel = require('./src/xlsxToLang');
const water = require('./src/waterMark');
const getLang = require('./src/getChinese');
const loadImg = require('./src/loadImg');
const ui = require('./src/texturePacker');
const reptile = require('./src/reptile');
const test = require('./src/__test');
global.UT = UT;
global.TimeUT = TimeUT;
//解析xlsx为多语言文件
program.command('xlsx')
    .description('必须cd到box_client/uni-app下执行命令，将box_cfg下对应版本目录lang.xlsx解析为多语言文件')
    .option('-t, --type <type>', '[optional]设置解析xlsx为.json格式还是.js格式，默认为.json\n')
    .action(({ type = "json" }) => {
        excel.doAction(type);
    })

//给图片加水印
program.command('water')
    .description('给图片加水印')
    .action(() => {
        water.doAction();
    })

//从网络上下载图片
program.command('loadimg')
    .description('从网络上下载图片')
    .action(() => {
        loadImg.doAction();
    })

//TexturePacker打包图集
program.command('ui')
    .description('TexturePacker打包图集，将box_art/ui底下的所有文件夹打包成图集')
    .action(() => {
        ui.doAction();
    })

// 中文收集并生成key对应中文的json文件  i18n-cli getlang -f zh.json -d pages,components
program.command('getlang')
    .description('对当前目录下的 .js .vue .json .php文件进行中文收集，默认当前目录下面所有文件\n')
    .option('-f, --filename <filename>', '[optional]设置生成的文件名，默认为 zh_cn.json，需为 .json 文件\n')
    .option('-d, --ignoredir <ignoredir>', '[optional]需要收集中文的文件夹，默认当前文件夹所有文件', value => {
        return value.split(',')
    })
    .action(({ filename = 'zh_cn.json', ignoredir }) => {
        getLang.doAction(filename, ignoredir);
    });


//爬虫下载图片
program.command('reptile')
    .description('爬虫下载图片')
    .action(() => {
        reptile.doAction();
    })
//测试脚本
program.command('test')
    .description('测试脚本')
    .action(() => {
        test.doAction();
    })

program.on('command:*', function () {
    UT.logRed(UT.formatStr('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' ')));
    process.exit(1);
});
if (process.argv.length === 2) {
    program.help();
}
program.parse(process.argv);
