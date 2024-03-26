const cheerio = require('cheerio');
const axios = require('axios');
let axiosOption = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    },
}
function sleep(time) {
    return new Promise(resolve => {
        let timer = setTimeout(() => {
            clearTimeout(timer || 1000);
            timer = null;
            resolve(0);
        }, time);
    });
}
async function t0(url) {
    sleep(500)
    let resHtml;
    try {
        resHtml = await axios.get(url, axiosOption)

    } catch (error) {
        if (error) {

            console.error(error);
        }
    }

    return resHtml
}
async function t1(url) {
    let resHtml = await t0(url)
    let $ = cheerio.load(resHtml.data)

    //--------

    let pages = $('.pageBtn span').eq(0).text().match(/\d+/g)[0]

    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)
    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(url)
            } else {
                let url1 = url.replace(/.html/, `_${i + 1}.html`)

                urlList.push(url1)
            }
        }
    }
    // console.log(urlList);
    return urlList


}

async function t2(url) {
    let resHtml = await t0(url)
    let $ = cheerio.load(resHtml.data)
    let urlList = []

    var pattern = /^(https?:\/\/[^\/]+)/;
    var match = url.match(pattern);
    let url1 = match[1]
    //------
    // console.log(url1);
    $('.channel-con .flex a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '' && !urlaa.includes('javascript')) {

            if (!urlaa.includes('www.gov.cn')) {
                urlList.push(url1 + urlaa)
            }
        }
    })

    // console.log(urlList);

    //------
    return urlList
}

async function t3(url) {

    try {

        let resHtml = await t0(url)
        let $ = cheerio.load(resHtml.data)


        let title = $('.text-center').text().trim()

        let publish_date = $('.addtime').text().trim()
        let author = $('.author').text().trim().split("\n")[1].trim()
        let content_h = $('body > div.box.pagecontent > div:nth-child(4)')
        let content = content_h.text()

        let digest = content_h.text().replace(/[\r\n\s]+/g, "").slice(0, 100);
        let img_exist = 0;
        let imgs = content_h.find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }



        // console.log(img_exist);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}
// t1('http://www.aytzcjw.cn/channels/13.html')
// t2('http://www.aytzcjw.cn/channels/13.html')
// t3('https://www.aytzcjw.cn/contents/13/935.html')

module.exports = {
    t1,
    t2,
    t3,
    location: '河南省-安阳市',
    tag: "政策文件",
    homeUrl: 'http://www.aytzcjw.cn/channels/13.html'
}   