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
        console.log('请求发送失败');
    }

    return resHtml
}
async function t1(url) {

    let resHtml = await t0(url)

    let $ = cheerio.load(resHtml.data)

    //--------
    let pages = $('.page-tile a').eq(-2).text()

    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)
    } else {
        let newUrl = url.replace(/.jhtml/, '')
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(url)
            } else {
                urlList.push(`${newUrl}_${i + 1}.jhtml`)
            }
        }
        // console.log(newUrl);
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
    url1 = match[1]

    //------
    $('.news-list a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            if (!urlaa.includes('http')) {
                urlaa = url1 + urlaa
            }
            if (!urlaa.includes('www.gov.cn')) {
                urlList.push(urlaa)
            }

        }
    })

    // console.log(urlList);

    //------
    return urlList
}

async function t3(url) {

    if (url.includes('zhengzhou')) {

        try {

            let resHtml = await t0(url)
            let $ = cheerio.load(resHtml.data)

            let title = $('.big-title').text().trim()
            let publish_date = $('.small-title').text().trim().split('：')[2].split(' ')[0].split('-').join('.')
            let str = $('.small-title').text()
            let index = str.indexOf("来源：") + 3;
            let end = str.indexOf("时间：");
            let author = str.slice(index, end);
            let content_h = $('.news_content_content')
            let content = content_h.html()

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




    } else {
        console.log('不是我需要的链接');
    }



}

module.exports = {
    t1,
    t2,
    t3,
    location: '河南省-郑州市',
    tag: "新闻动态",
    homeUrl: 'https://swj.zhengzhou.gov.cn/tzzz/index.jhtml'
}   
