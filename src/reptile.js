const download = require('download')
const axios = require('axios')

const doAction = () => {
    TimeUT.consoleStartCli("reptile");
    load();
}

let headers = {
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
}

function sleep(time) {
    return new Promise((reslove) => setTimeout(reslove, time))
}

async function load(skip = 0) {
    const data = await axios.get('http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000000/vertical',
            {
                headers,
                params: {
                    limit: 30, // 每页固定返回30条
                    skip: skip,
                    first: 0,
                    order: 'hot',
                },
            }
        )
        .then((res) => {
            return res.data.res.vertical;
        })
        .catch((err) => {
            UT.logRed(err)
        })
    await downloadFile(data)
    await sleep(3000)
    if (skip < 500) {
        load(skip + 30)
    } else {
        TimeUT.consoleEndCli("reptile");
    }
}

async function downloadFile(data) {
    for (let index = 0; index < data.length; index++) {
        const item = data[index]

        // Path at which image will get downloaded
        const filePath = `${__dirname}/美女`

        await download(item.wp, filePath, {
            filename: item.id + '.jpeg',
            headers,
        }).then(() => {
            TimeUT.logwithTimeStr(`Download ${item.id} Completed`)
            return;
        })
    }
}

module.exports = {
    doAction
}

