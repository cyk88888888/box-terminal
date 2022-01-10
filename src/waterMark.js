const gm = require('gm').subClass({ imageMagick: true });
const timeUT = require('../lib/timeUT');

const doAction = () => {
    timeUT.consoleStartCli("water", new Date());
    toWaterMark();
}

const toWaterMark = () => {
    let rootUrl = __dirname.split("src")[0].replace(/\\/g, "/");
    let imgWidth, imgHeight;
    let originalImg = rootUrl + "/img/test.jpg";
    gm(originalImg)	//指定添加水印的图片
        .size(function (err, val) {
            imgWidth = val.width;
            imgHeight = val.height;
            console.log(originalImg + "图片宽高: " + imgWidth + "," + imgHeight);
        }).stroke("white")		//字体外围颜色
        .fill("white")			//字体内围颜色（不设置默认为黑色）
        .font(rootUrl + "font/msyh.ttf", 30) //字库所在文件夹和字体大小
        .drawText(50, 50, "中文China")
        .rotate("white", 50)
        .write(rootUrl + "/img/watermark.jpg", function (err) {
            if (!err) timeUT.consoleEndCli("water");
            else console.log(err);
        });
}

module.exports = {
    doAction
}