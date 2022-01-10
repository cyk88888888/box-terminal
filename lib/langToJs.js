const xlsx = require('node-xlsx').default
const fs = require('fs');
const path = require('path');
let cfg;
if(process.cwd().indexOf("box_client") > -1 && process.cwd().indexOf("uni-app") > -1){
    cfg = require(process.cwd() + '/lang/langCfg');
}
const doAction = () =>{
    if(!cfg){
        console.error("Error:----->必须cd到box_client/uni-app下执行命令");
        process.exit();
        return;
    }
    console.log(">>>>>>>>开始执行命令【xlsx】（" + process.cwd() + "）...<<<<<<<<");
    let xlsxVersion = cfg.xlsxVersion;
    let xlsxRoot = process.cwd().split("box_client")[0] + "box_cfg" + path.sep + xlsxVersion + path.sep + "lang";//xlsx根目录
    let writeJsRoot = process.cwd() + path.sep + "lang"+ path.sep +"langs";//要写入的js多语言文件根目录
    fs.access(xlsxRoot, (err) => {
        if (err) {
            console.error(`多语言xlsx根目录${xlsxRoot}不存在`);
            process.exit();
        } else {
            fs.access(writeJsRoot, (err) => {
                if (err) {
                    console.error(`要写入的多语言js文件的根目录${writeJsRoot}不存在`);
                    process.exit();
                }else{
                    tojs(xlsxRoot, writeJsRoot, (err) => {
                        if (err) {
                            console.error(err)
                        } else {
                            // console.log("%s: 命令【xlsx】执行完毕，共耗时%s秒！");
                            console.log('finish!')
                        }
                    })
                }
            })
        }
    });
}

const tojs = (xlsxRoot,writeJsRoot,cb)  => {
    console.log("xlsxRoot----------------------->" + xlsxRoot);
    console.log("writeJsRoot----------------------->" + writeJsRoot);
    try {
        fs.readdir(xlsxRoot, function(err, files){
            if(err){
                cb(err);
            }else{
                files.forEach(function(filename){
                    if(filename.split(".")[1] == "xlsx" && filename.indexOf("$") == -1){//判断是否为xlsx文件
                        // console.log(xlsxRoot + path.sep +  filename + "--------jsName: " + filename.split(".")[0] + ".js");
                        writeToJs(xlsxRoot + path.sep +  filename, writeJsRoot);
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
     * 写入到js文件
     * @param xlsxUrl 对应xlsx文件的全路径
     * @param toJsName 要写入的js文件名
     */
    function writeToJs(xlsxUrl, writeJsRoot){
        try {
            let res = fs.readFileSync(xlsxUrl);
            const xlsxData = xlsx.parse(res)[0].data; // 第一个sheet
            let langs = [];
            let langMap = {};
            //获取语言列表
            for(let i = 0;i< xlsxData[0].length; i++){//第一行标题
                if(i != 0) {
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

            for(let lang in langMap){
                let toJsName = lang + ".js";
                let langJsonData = langMap[lang];
                let code = `export default ${JSON.stringify(langJsonData, '', 2).replace(/\"/g, '\'')}\r\n`;
                let writeUrl = writeJsRoot + path.sep + toJsName;//写入的js文件目录地址
                // console.log("writeUrl------------------->" + writeUrl);
                fs.writeFile(writeUrl, code,{'flag':'w'}, function(err) {
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