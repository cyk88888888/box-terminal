const xlsx = require('node-xlsx').default
const fs = require('fs');
const path = require('path');


const tojs = (xlsxRoot,cb)  => {
    console.log("xlsxRoot----------------------->" + xlsxRoot);
    try {
        fs.readdir(xlsxRoot, function(err, files){
            if(err){
                cb(err);
            }else{
                files.forEach(function(filename){
                    if(filename.split(".")[1] == "xlsx" && filename.indexOf("$") == -1){//判断是否为xlsx文件
                        // console.log(xlsxRoot + path.sep +  filename + "--------jsName: " + filename.split(".")[0] + ".js");
                        writeToJs(xlsxRoot + path.sep +  filename);
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
     * @param url 对应xlsx文件的全路径
     * @param toJsName 要写入的js文件名
     */
    function writeToJs(url){
        try {
            let res = fs.readFileSync(url);
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
                let writeUrl = process.cwd() + path.sep + "uni-app" + path.sep + "lang"+ path.sep +"langs" + path.sep + toJsName;//写入的js文件目录地址
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
    tojs
}