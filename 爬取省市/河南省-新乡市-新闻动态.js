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
    sleep(500)
    let res = await fetch("http://www.xinxiang.gov.cn/sitesources/xxsrmzf/page_pc/zwgk/jrxx/script.json", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9",
            "if-modified-since": "Tue, 12 Dec 2023 01:51:21 GMT",
            "if-none-match": "W/\"236-1702345881000\"",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "mode=2; Hm_lvt_30118f867de1399eb4e7cb998fb4bf47=1702346292; Hm_lpvt_30118f867de1399eb4e7cb998fb4bf47=1702346292; Hm_lvt_63a9a12ea3e7580fd15ff8758683c704=1702346292; Hm_lpvt_63a9a12ea3e7580fd15ff8758683c704=1702346292; wzafullscreen=0",
            "Referer": "http://www.xinxiang.gov.cn/sitesources/xxsrmzf/page_pc/zwgk/jrxx/list2.html",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(res => res.json());
    let pages = res.endPage
    //--------
    // console.log(pages);

    //--------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)
    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(url)
            } else {
                let url1 = url.replace(/\d+/, `${i + 1}`)

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
    url1 = match[1]
    //------
    $('.hap_infoBox a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {

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

        let title = $('.hap_xq_tit').text().trim()

        let publish_date = $('.hap_xq_data span').eq(2).text().split(' ')[0].split('-').join('.')
        let author = $('.hap_xq_data span').eq(1).text().trim()
        let content_h = $('.hap_xq_content')
        let content = content_h.text()

        let digest = content_h.text().replace(/[\r\n\s]+/g, "").slice(0, 100);
        let img_exist = 0;
        let imgs = content_h.find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }



        // console.log(digest);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}
// t1('http://www.xinxiang.gov.cn/sitesources/xxsrmzf/page_pc/zwgk/jrxx/list1.html')
// t2('http://www.xinxiang.gov.cn/sitesources/xxsrmzf/page_pc/zwgk/jrxx/list6.html')
// t3('http://www.xinxiang.gov.cn/sitesources/xxsrmzf/page_pc/zwgk/jrxx/article0ea5c1ef3c73492e8d1c03c50bd44e31.html')

module.exports = {
    t1,
    t2,
    t3,
    location: '河南省-新乡市',
    tag: "新闻动态",
    homeUrl: 'http://www.xinxiang.gov.cn/sitesources/xxsrmzf/page_pc/zwgk/jrxx/list1.html'
}   