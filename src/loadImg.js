const xlsx = require('node-xlsx').default;
const fs = require('fs');
const path = require('path');
const request = require("request");
const doAction = (type = 'json') => {
    TimeUT.consoleStartCli("loadimg", new Date());

    let xlsxRoot = process.cwd();//xlsx根目录
    let writeImgRoot = process.cwd() + path.sep + "loadImg";//要写入的文件根目录

    fs.access(xlsxRoot, (err) => {
        if (err) {
            console.error(`目录${xlsxRoot}不存在`);
            process.exit();
        } else {
            if (!fs.existsSync(writeImgRoot)) fs.mkdirSync(writeImgRoot);
            readFile(xlsxRoot, writeImgRoot, (err) => {
                if (err) {
                    console.error(err)
                } else {
                    TimeUT.consoleEndCli("loadimg");
                }
            })
        }
    });
}

const readFile = (xlsxRoot, writeImgRoot, cb) => {
    let curTimeStr = TimeUT.getCurTimeStr();
    console.log("%s: xlsxRoot----------------------->%s", curTimeStr, xlsxRoot);
    console.log("%s: writeImgRoot----------------------->%s", curTimeStr, writeImgRoot);
    try {
        fs.readdir(xlsxRoot, function (err, files) {
            if (err) {
                cb(err);
            } else {
                files.forEach(function (filename) {
                    if (filename.split(".")[1] == "xlsx" && filename.indexOf("$") == -1) {//判断是否为xlsx文件
                        console.log(filename);
                        writeToFile(xlsxRoot + path.sep + filename, writeImgRoot).then(() => {
                            cb();
                        });
                    }
                });
            }
        });
    } catch (err) {
        // 出错了
        cb(err)
    }

    /**
     * 写入内容到文件
     * @param xlsxUrl 对应xlsx文件的全路径
     * @param toJsName 要写入的js文件名
     */
    function writeToFile(xlsxUrl, writeJsRoot) {
        let res = fs.readFileSync(xlsxUrl);
        let allXlsxData = xlsx.parse(res);
        // console.log(allXlsxData);
        // const xlsxData = allXlsxData[0].data; // 第一个sheet

        let langMap = {};
        for (let index = 0; index < allXlsxData.length; index++) {
            const xlsxData = allXlsxData[index].data;
            for (let i = 0; i < xlsxData.length; i++) {//读行
                if (i == 0) continue;//第一行是key
                for (let j = 0; j < xlsxData[i].length; j++) {//读列
                    if (j == 0) langMap[xlsxData[i][0]] = { firstImgName: xlsxData[0][1], firstImgUrl: xlsxData[i][1], dirName: xlsxData[0][2], imgList: [] };
                    else if (j >= 2) {
                        langMap[xlsxData[i][0]].imgList.push(xlsxData[i][j]);
                    }
                }
            }
        }

        // console.log(langMap);
        let ps = [];
        for (let key in langMap) {
            let info = langMap[key];
            let rootUrl = writeJsRoot + path.sep + key;
            let subRootUrl = rootUrl + path.sep + info.dirName;
            UT.deleteFolderRecursive(rootUrl);

            fs.mkdirSync(rootUrl);
            fs.mkdirSync(subRootUrl);
            let imgUrl = info.firstImgUrl;
            let filename = info.firstImgName + ".jpg";
            let p = new Promise((resolve, reject) => {
                request(imgUrl).pipe(fs.createWriteStream(rootUrl + path.sep + filename).addListener('finish', function () {
                    resolve();
                }));
            })
            ps.push(p);
            for (let i = 0; i < info.imgList.length; i++) {
                let pItem = new Promise((resolve, reject) => {
                    request(info.imgList[i]).pipe(fs.createWriteStream(subRootUrl + path.sep + i + ".jpg").addListener('finish', function () {
                        resolve();
                    }));
                })
                ps.push(pItem);
            }
        }
        return Promise.all(ps);
    }
}

module.exports = {
    doAction
}