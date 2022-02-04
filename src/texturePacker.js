const exec = require('child_process').exec;
const timeUT = require('../lib/timeUT');

const doAction = () => {
    timeUT.consoleStartCli("ui", new Date());
    
    let src = __dirname.split('src')[0] + 'img';
    let src1 = __dirname.split('src')[0] + 'img1';
    console.log(src);
    // //TexturePacker的指令字符串
    let cli = 'TexturePacker --format cocos2d-x --data pack.plist --sheet pack.png ' + src + ' --png-opt-level 0 --max-width 2048 --max-height 2048';

    exec(cli, { encoding: 'utf8' }, function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            console.log('stderr:' + stderr);
            return;
        }
        console.log('stdout:' + stdout);
   
        timeUT.consoleEndCli("ui");
    });
}

module.exports = {
    doAction
}

