const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const doAction = () => {
    TimeUT.consoleStartCli("ui");
    let uiRoot = __dirname.split('box-ternima')[0] + 'box_art' + path.sep + 'ui';
    fs.access(uiRoot, (err) => {
        if (err) {
            UT.logRed(`ui根目录${uiRoot}不存在`);
            process.exit();
        } else {
            fs.readdir(uiRoot, function (err, files) {
                if (err) {
                    UT.logRed(err);
                } else {
                    texturePacker(uiRoot, files);
                }
            });
        }
    })
}

const texturePacker = (uiRoot, uiFileNames) => {
    let writeImgRoot = uiRoot + path.sep + "__out";//要写入的文件根目录
    UT.deleteFolderRecursive(writeImgRoot, true);
    if (!fs.existsSync(writeImgRoot)) fs.mkdirSync(writeImgRoot);
    let srcArr = [];
    for (let index = 0; index < uiFileNames.length; index++) {
        const fileName = uiFileNames[index];
        if(fileName == '__out') continue;//该目录为导出合图的文件夹
        let fullPath = uiRoot + path.sep + fileName;
        const stat = fs.statSync(fullPath);
        if (!stat.isDirectory()) continue;//非文件夹过滤，不合图
        srcArr.push({fullPath: fullPath,fileName:fileName});
    }

    if (srcArr.length == 0) {
        global.TimeUT.consoleEndCli("ui");
        return;
    }
    let ps = [];
    for (let i = 0; i < srcArr.length; i++) {
        let fileName = srcArr[i].fileName;
        let fullPath = srcArr[i].fullPath;
        let plistName = fileName + '.plist';
        let outPngName = fileName + '.png';
        //TexturePacker的指令字符串
        let cli = 'TexturePacker --format cocos2d-x --data ' + plistName + ' --sheet ' + outPngName + ' --png-opt-level 0 --max-width 2048 --max-height 2048 ' + fullPath;
        let p = new Promise((resolve, reject) => {
            exec(cli, { cwd: writeImgRoot, encoding: 'utf8' }, function (err, stdout, stderr) {
                if (err) {
                    UT.logRed(err);
                    UT.logRed('stderr:' + stderr);
                    reject();
                    return;
                }
                // console.log('stdout:' + stdout);
                resolve();
            });

        });
        ps.push(p);
    }

    Promise.all(ps).then(()=>{
        TimeUT.consoleEndCli("ui");
    })

}

module.exports = {
    doAction
}

