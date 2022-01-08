const images = require('images');
const fs = require('fs');
const path = require('path');

var watermarkImg = images('water_logo.png');
var sourceImg = images('source.png');
 
// 比如放置在右下角，先获取原图的尺寸和水印图片尺寸
var sWidth = sourceImg.width();
var sHeight = sourceImg.height();
var wmWidth = watermarkImg.width();
var wmHeight = watermarkImg.height();
 
images(sourceImg)
    // 设置绘制的坐标位置，右下角距离 40px
    .draw(watermarkImg, sWidth - wmWidth - 40, sHeight - wmHeight - 40)
    // 保存格式会自动识别
    .save('saveimg.png');