const xlsx = require('node-xlsx').default;
const fs = require('fs');
const path = require('path');
const cfg = require(__dirname.split('src')[0] + '.env');
const doAction = (type) => {
    let isServer = process.cwd().indexOf("box_server") > -1;//是否为编后端的表
    if (isServer && process.cwd().indexOf("na_manghe") == -1) {//服务端编译表的起始路径
        UT.logRed("Error:----->必须cd到na_manghe下执行命令");
        process.exit();
        return;
    }
    if (!isServer && process.cwd().indexOf("uni-app") == -1 && process.cwd().indexOf("box-app") == -1) {//客户端编译表的起始路径
        UT.logRed("Error:----->必须cd到uni-app或者box-app下执行命令");
        process.exit();
        return;
    }
    TimeUT.consoleStartCli("xlsx");
    let xlsxVersion = cfg.xlsxVersion;
    let preUrl = isServer ? process.cwd().split("box_server")[0] : process.cwd().indexOf("box_common") > -1 ? process.cwd().split("box_common")[0] : process.cwd().split("box_client")[0];
    let xlsxRoot = preUrl + "box_cfg" + path.sep + xlsxVersion + path.sep + "lang";//xlsx根目录
    let writeRoot = process.cwd() + path.sep + (isServer ? "app" +  path.sep + "lang" : "lang" + path.sep + "langs") ;//要写入的多语言文件根目录
    fs.access(xlsxRoot, (err) => {
        if (err) {
            console.error(`多语言xlsx根目录${xlsxRoot}不存在`);
            process.exit();
        } else {
            fs.access(writeRoot, (err) => {
                if (err) {
                    console.error(`要写入的多语言文件的根目录${writeRoot}不存在`);
                    process.exit();
                } else {
                    readFile(xlsxRoot, writeRoot, type, isServer, (err) => {
                        if (err) {
                            console.error(err)
                        } else {
                            TimeUT.consoleEndCli("xlsx");
                        }
                    })
                }
            })
        }
    });
}

const readFile = (xlsxRoot, writeRoot, type, isServer, cb) => {
    TimeUT.logwithTimeStr(UT.formatStr('xlsxRoot----------------------->%s', xlsxRoot));
    TimeUT.logwithTimeStr(UT.formatStr('writeRoot----------------------->%s', writeRoot));
    let xlsxName = isServer ? "server_lang" : "lang";//表名
    try {
        fs.readdir(xlsxRoot, function (err, files) {
            if (err) {
                cb(err);
            } else {
                let ps = [];
                let isJson = type == "json";
                files.forEach(function (filename) {
                    if (filename.split(".")[0] == xlsxName && filename.split(".")[1] == "xlsx" && filename.indexOf("$") == -1) {//判断是否为xlsx文件
                        ps = ps.concat(writeToFile(xlsxRoot + path.sep + filename, writeRoot, isJson));
                    }
                });
                Promise.all(ps).then(() => {
                    cb();
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
     * @param writeRoot 要写入的文件路径前缀
     */
    function writeToFile(xlsxUrl, writeRoot, isJson) {
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

        let ps = [];
        for (let lang in langMap) {
            let fileName = lang + (isJson ? ".json" : ".js");
            let langJsonData = langMap[lang];
            let code = '';
            if (isJson) {
                code = JSON.stringify(langJsonData, '', 2);//.replace(/\"/g, '\'');
            } else {
                code = `export default ${JSON.stringify(langJsonData, '', 2)}\r\n`;
            }
            let writeUrl = writeRoot + path.sep + fileName;//写入的文件全目录
            let p = new Promise((resolve, reject) => {
                fs.writeFile(writeUrl, code, {'flag': 'w'}, function (err) {
                    if (!err) resolve();
                    else console.error(err);
                })
            });
            ps.push(p);
        }
        return ps;
    }
}
module.exports = {
    doAction
}