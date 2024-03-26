const cheerio = require('cheerio');
const axios = require('axios');
let axiosOption = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    },
}
async function t1(url) {

    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)

    //--------
    let str = $(".gly-lm2 ul li:last").nextAll("script").text();
    var pattern = /(\d+)/;
    var match = str.match(pattern);
    let pages = parseInt(match[0]);
    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)

    } else {
        for (let i = 1; i <= pages; i++) {
            if (i === 1) {
                urlList.push(url)
            } else {
                const newUrl = url.replace(".shtml", "");
                urlList.push(`${newUrl}_${i}.shtml`)
            }
        }

    }
    // console.log(urlList);
    return urlList
}

async function t2(url) {
    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    var pattern = /^(https?:\/\/[^\/]+)/;
    var match = url.match(pattern);
    url1 = match[1]
    //------
    $('.gly-lm2 a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            if (!urlaa.includes('http')) {
                urlaa = url1 + urlaa
            }
            urlList.push(urlaa)
        }
    })

    // console.log(urlList);

    //------
    return urlList
}

async function t3(url) {

    try {

        let resHtml = await axios.get(url, axiosOption)
        let $ = cheerio.load(resHtml.data)


        let title = $('.xly-t h1').text().trim()
        let publish_date = $('.xly-x span').eq(0).text().trim().split(' ')[0].split('-').join('.')
        let content = $('.xly-nr').text()

        let digest = $('.xly-nr').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('.xly-nr').find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }


        let author = $('.xly-x span').eq(1).text().trim().split('：')[1]
        // console.log(author);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}

// t1('https://www.hainan.gov.cn/hainan/zmgyshj/list_hnzymyg.shtml')
// t2('https://www.hainan.gov.cn/hainan/zcfgqh/list_hnzymyg.shtml')
// t3('https://www.hainan.gov.cn/hainan/zmghnwj/202305/9b10a3ce52a049269ef0f5d37f587370.shtml?ddtab=true')
module.exports = {
    t1,
    t2,
    t3,
    location: '海南省-自由贸易港',
    tag: "营商政策",
    homeUrl: 'https://www.hainan.gov.cn/hainan/zmgyshj/list_hnzymyg.shtml'
}   