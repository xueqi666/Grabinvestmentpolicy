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
    let str = $(".yj-page ").text();
    const regex = /createPageHTML\((\d+)/;
    const match = str.match(regex);
    let pages = parseInt(match[1]);
    //--------
    let urlList = []
    if (pages === 1) {
        urlList.push(`${url}index.html`)
        return urlList
    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(`${url}index.html`)
            } else {
                urlList.push(`${url}index_${i}.html`)
            }
        }
        return urlList


    }
}

async function t2(url) {
    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    //------
    $('.zctb a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
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


        let title = $('.tm').text().trim();
        let publish_date = $('.forlin p').eq(2).find('.sp2 .xq').text().trim().split('-').join('.');
        let content = $('.dps').text()
        let digest = $('.dps').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('.dps').find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }
        let author = $('.forlin p').eq(1).find('.sp1 .xq').text().trim()
        // console.log(author);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}
// t1('http://www.qinghai.gov.cn/xxgk/8/16/')
// t2('http://www.qinghai.gov.cn/xxgk/8/16/')
// t3('http://www.qinghai.gov.cn/xxgk/xxgk/fd/zfwj/202204/t20220413_189436.html')

module.exports = {
    t1,
    t2,
    t3,
    location: '青海省',
    tag: "政策文件",
    homeUrl: 'http://www.qinghai.gov.cn/xxgk/8/16/'
}   