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


module.exports = {
    deleteFolderRecursive,
}
