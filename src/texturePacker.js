const exec = require('child_process').exec;
const timeUT = require('../lib/timeUT');
const path = require('path');
const fs = require('fs');
const doAction = () => {
    timeUT.consoleStartCli("ui", new Date());
    let uiRoot = __dirname.split('box-terminal')[0] + 'box_art' + path.sep + 'ui';
    fs.access(uiRoot, (err) => {
        if (err) {
            console.error(`ui根目录${uiRoot}不存在`);
            process.exit();
        } else {
            fs.readdir(uiRoot, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    texturePacker(uiRoot, files);
                }
            });
        }
    })
}

const texturePacker = (uiRoot, uiFileNames) => {
    let src = '';
    for (let index = 0; index < uiFileNames.length; index++) {
        const element = uiFileNames[index];
        let needBlank = index != 0;
        src += (needBlank ? ' ' : '') + uiRoot + path.sep + element;
    }
    console.log(src);
    //TexturePacker的指令字符串
    let cli = 'TexturePacker --format cocos2d-x --data pack.plist --sheet pack.png --png-opt-level 0 --max-width 2048 --max-height 2048 ' + src;

    exec(cli, { encoding: 'utf8' }, function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            console.log('stderr:' + stderr);
            return;
        }
        // console.log('stdout:' + stdout);

        timeUT.consoleEndCli("ui");
    });
}

module.exports = {
    doAction
}

