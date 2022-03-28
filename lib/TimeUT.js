const sd = require('silly-datetime');

/**
 * 获取两个date的间隔时间
 * @param {*} sDate 
 * @param {*} eDate 
 * @param {*} diffType 
 * @returns 
 */
const getDateDiff = (sDate, eDate, diffType = "second") => {
    //作为除数的数字
    var divNum = 1000;

    switch (diffType) {

        case "second":

            divNum = 1000;

            break;

        case "minute":

            divNum = 1000 * 60;

            break;

        case "hour":

            divNum = 1000 * 3600;

            break;

        case "day":

            divNum = 1000 * 3600 * 24;

            break;

        default:

            break;

    }
    return (eDate.getTime() - sDate.getTime()) / parseInt(divNum);
}

let stDate;
const consoleStartCli = (cli) => {
    stDate = curDate();
    logwithTimeStr(UT.formatStr(">>>>>>>>开始执行命令【%s】（%s）...<<<<<<<<", cli, process.cwd()));
}

const consoleEndCli = (cli) => {
    logwithTimeStr(UT.formatStr('命令【%s】执行完毕，共耗时%s秒！', cli, getDateDiff(stDate, curDate()) + ''))
}

const logwithTimeStr = (msg) => {
    console.log("%s: %s", getCurTimeStr(), msg);
}

/**
 * 获取当前时间的字符串描述
 * @param {时间格式} formatStr 
 * @returns 
 */
const getCurTimeStr = (formatStr = 'YYYY-MM-DD HH:mm:ss') => {
    return sd.format(curDate(), formatStr);
}

const curDate = () => {
    return new Date();
}

module.exports = {
    getDateDiff,
    consoleStartCli,
    consoleEndCli,
    getCurTimeStr,
    logwithTimeStr
}
