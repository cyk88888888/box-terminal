const xlsx = require('node-xlsx').default;
const fs = require('fs');
const path = require('path');
const timeUT = require('../lib/timeUT')
let cfg;
if (process.cwd().indexOf("box_client") > -1 && process.cwd().indexOf("uni-app") > -1) {
    cfg = require(process.cwd() + '/lang/langCfg');
}
const doAction = (type = 'json') => {
    if (!cfg) {
        console.error("Error:----->必须cd到box_client/uni-app下执行命令");
        process.exit();
        return;
    }
    timeUT.consoleStartCli("xlsx", new Date());
    let xlsxVersion = cfg.xlsxVersion;
    let xlsxRoot = process.cwd().split("box_client")[0] + "box_cfg" + path.sep + xlsxVersion + path.sep + "lang";//xlsx根目录
    let writeJsRoot = process.cwd() + path.sep + "lang" + path.sep + "langs";//要写入的js多语言文件根目录
    fs.access(xlsxRoot, (err) => {
        if (err) {
            console.error(`多语言xlsx根目录${xlsxRoot}不存在`);
            process.exit();
        } else {
            fs.access(writeJsRoot, (err) => {
                if (err) {
                    console.error(`要写入的多语言js文件的根目录${writeJsRoot}不存在`);
                    process.exit();
                } else {
                    readFile(xlsxRoot, writeJsRoot, type, (err) => {
                        if (err) {
                            console.error(err)
                        } else {
                            timeUT.consoleEndCli("xlsx");
                        }
                    })
                }
            })
        }
    });
}

const readFile = (xlsxRoot, writeJsRoot, type, cb) => {
    let curTimeStr = timeUT.getCurTimeStr();
    console.log("%s: xlsxRoot----------------------->%s", curTimeStr, xlsxRoot);
    console.log("%s: writeJsRoot----------------------->%s", curTimeStr, writeJsRoot);
    try {
        fs.readdir(xlsxRoot, function (err, files) {
            if (err) {
                cb(err);
            } else {
                files.forEach(function (filename) {
                    if (filename.split(".")[1] == "xlsx" && filename.indexOf("$") == -1) {//判断是否为xlsx文件
                        writeToFile(xlsxRoot + path.sep + filename, writeJsRoot, type == "json");
                    }
                });
                cb();
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
    function writeToFile(xlsxUrl, writeJsRoot, isJson) {
        try {
            let res = fs.readFileSync(xlsxUrl);
            const xlsxData = xlsx.parse(res)[0].data; // 第一个sheet
            let langs = [];
            let langMap = {};
            //获取语言列表
            for (let i = 0; i < xlsxData[0].length; i++) {//第一行标题
                if (i != 0) {
                    let lang = xlsxData[0][i];
                    langs.push(lang);
                    langMap[lang] = {};
                }
            }
            xlsxData.shift();// 去除第一行，第一行是标题
            for (let j = 0; j < xlsxData.length; j++) {
                let key = xlsxData[j][0];
                for (let i = 0; i < langs.length; i++) {
                    let lang = langs[i];//当前语言
                    let value = xlsxData[j][i + 1] ? xlsxData[j][i + 1] : xlsxData[j][1];//没有值默认取中文
                    if (value) value = value.replace('\"\'', '\\\'');
                    langMap[lang][key] = value;
                }
            }
            for (let lang in langMap) {
                let toJsName = lang + (isJson ? ".json" : ".js");
                let langJsonData = langMap[lang];
                let code = '';
                if (isJson) {
                    code = JSON.stringify(langJsonData, '', 2).replace(/\"/g, '\'');
                    code = code.replace(/\'/g, '"');
                } else {
                    code = `export default ${JSON.stringify(langJsonData, '', 2).replace(/\"/g, '\'')}`;
                }
                let writeUrl = writeJsRoot + path.sep + toJsName;//写入的js文件目录地址
                fs.writeFile(writeUrl, code, { 'flag': 'w' }, function (err) {
                    if (err) console.error(err)
                });
            }
        } catch (err) {
            // 出错了
            cb(err)
        }
    }
}

module.exports = {
    doAction
}