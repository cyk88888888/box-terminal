const sd = require('silly-datetime');

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
const consoleStartCli = (cli, stTime) => {
    stDate = stTime;
    console.log("%s: >>>>>>>>开始执行命令【%s】（" + process.cwd() + "）...<<<<<<<<", sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),cli);
}

const consoleEndCli = (cli) => {
    console.log("%s: 命令【%s】执行完毕，共耗时%s秒！", sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), cli, getDateDiff(stDate, new Date()) + '');
}
module.exports = {
    getDateDiff,
    consoleStartCli,
    consoleEndCli
}
