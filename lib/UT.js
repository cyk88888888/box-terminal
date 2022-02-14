const fs = require('fs');

let deleteFolderRoot;
/**
 * 删除某个文件夹
 * @param {*} path 删除的文件夹
 * @param {*} isOnlyDeleteContent 是否只删除该文件夹目录下的内容
 */
const deleteFolderRecursive = (path, isOnlyDeleteContent) => {
    deleteFolderRoot = path;
    deleteFolder(path);
    function deleteFolder(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolder(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            if(!isOnlyDeleteContent) fs.rmdirSync(path);
            if(isOnlyDeleteContent && deleteFolderRoot != path) fs.rmdirSync(path);
        }
    }
}

/**
 * 输出红色字体的log
 * 样式详见 https://www.cnblogs.com/taohuaya/p/13948401.html
 */
const logRed = (msg) => {
    console.log('\033[31m' + msg + '\033[0m');
}

/**
 * 填充字符串(占位符为%s)
 * @param {*} msg 
 * @param  {...any} args 
 * @returns 
 */
const formatStr = (msg, ...args) => {
    if(args.length == 0){
        return msg;
    }
    for (let index = 0; index < args.length; index++) {
        const element = args[index];
        msg = msg.replace(new RegExp("%s"), element);
    }
    return msg;
}

module.exports = {
    deleteFolderRecursive,
    logRed,
    formatStr,
}
