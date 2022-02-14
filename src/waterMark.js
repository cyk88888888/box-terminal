const gm = require('gm').subClass({imageMagick: true});//加载ImageMagick
// const os = require('os');
const fs = require('fs');
const path = require('path');
// let dirU = os.type().toLowerCase().includes('window') ? '\\' : '/' // window环境使用‘\\’mac系统使用‘/’

const doAction = (ignoredir) => {
    if (process.cwd().indexOf("box_client") == -1) {
        console.error("Error:-------------->必须cd到box_client 或者 box_client/uni-app下执行命令");
        process.exit();
        return;
    }
    TimeUT.consoleStartCli("water", new Date());
    let artRoot = process.cwd().split("box_client")[0] + "box_art";
    let originalRoot = artRoot + path.sep + "original";//要加水印的根目录
    let outRoot = artRoot + path.sep + "out";//要保存加好水印图片的根目录
    let curTimeStr = TimeUT.getCurTimeStr();
    fs.access(originalRoot, (err) => {
            if (err) {
                UT.logRed(UT.formatStr("%s: 要加水印的根目录----------------------->%s 不存在",curTimeStr, originalRoot));
                process.exit();
            } else {
                fs.access(outRoot, (err) => {
                        if (err) {
                            UT.logRed(UT.formatStr("%s: 要保存加好水印图片的根目录----------------------->%s 不存在", curTimeStr, outRoot));
                            process.exit();
                        } else {
                            readFileList(originalRoot, outRoot, ignoredir).then(() => {
                                TimeUT.consoleEndCli("water");
                            });
                        }
                    }
                );
            }
        }
    );
}

function readFileList(originalRoot, outRoot, ignoredir) {
    let curTimeStr = TimeUT.getCurTimeStr();
    console.log("%s: originalRoot----------------------->%s", curTimeStr, originalRoot);
    console.log("%s: outRoot----------------------->%s", curTimeStr, outRoot);
    let filesPathList = [];
    let ps = [];
    getFileList(originalRoot, filesPathList, ignoredir);
    filesPathList.forEach((fullPath) => {
        let p = null;
        let extname = path.extname(fullPath);
        if (['.png', '.jpg', '.gif'].includes(extname)) {
            p = new Promise((resolve, reject) => {
                toWaterMark(fullPath, function () {
                    resolve();
                })
            });
        }
        ps.push(p)
    });
    return Promise.all(ps);
}

function getFileList(dir, filesPathList = [], ignoredir) {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        if (ignoredir && ignoredir.includes(item)) return;
        let fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            return getFileList(fullPath, filesPathList, ignoredir); // 递归读取文件
        } else {
            filesPathList.push(fullPath);
        }
    });
    return filesPathList;
}

const toWaterMark = (fullPath, cb) => {
    let rootUrl = __dirname.split("src")[0];//box-terminal根目录
    let basename = path.basename(fullPath);
    let basenameSplit = basename.split(".");
    let outBasePath = fullPath.split("original")[0];
    let orginalImgUrl = fullPath;
    let outImgUrl = outBasePath + "out" + path.sep + basenameSplit[0] + "." + basenameSplit[1];
    // outImgUrl = outImgUrl.replace(/\\/g, "/");
    let imgWidth, imgHeight;
    gm(orginalImgUrl)	//指定添加水印的图片
        .size(function (err, val) {
            imgWidth = val.width;
            imgHeight = val.height;
            let curTimeStr = TimeUT.getCurTimeStr();
            console.log("%s: " + orginalImgUrl + " 图片宽高: " + imgWidth + "," + imgHeight, curTimeStr);
        })
        .stroke("black")		//字体外围颜色
        .fill("black")			//字体内围颜色（不设置默认为黑色）
        .font(rootUrl + "font/msyh.ttf", 30) //字库所在文件夹和字体大小
        .drawText(0, 0, "中文China\nchina", 'northeast')
        .write(outImgUrl, function (err) {
            if (!err) cb();
            else console.log(err);
        });
}

module.exports = {
    doAction
}