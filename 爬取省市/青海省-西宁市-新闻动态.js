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
    let str = $(".gl-page").text();
    const regex = /createPage\((\d+)/;
    const match = str.match(regex);
    let pages = parseInt(match[1]);
    //--------
    let urlList = []
    if (pages === 1) {
        urlList.push(`${url}index.html`)

    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(`${url}index.html`)
            } else {
                urlList.push(`${url}index_${i}.html`)
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
    //------
    let homeUrl = 'https://www.xining.gov.cn/xwdt/xnyw/'
    $('.gl-list a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            urlList.push(homeUrl + urlaa)
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


        let title = $('.xx-tit').text().trim();
        let publish_date = $('.cm-con').eq(0).text().trim().split('-').join('.')
        let content = $('#wenzhangzhengwen').html()
        let digest = $('#wenzhangzhengwen').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('#wenzhangzhengwen').find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }
        let author = $('.cm-con').eq(1).text().trim()
        console.log(author);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}
// t1('https://www.xining.gov.cn/xwdt/xnyw/')

// t2('https://www.xining.gov.cn/xwdt/xnyw/')
// t3('https://www.xining.gov.cn/xwdt/xnyw/202311/t20231129_195798.html')

module.exports = {
    t1,
    t2,
    t3,
    location: '青海省-西宁市',
    tag: "新闻动态",
    homeUrl: 'https://www.xining.gov.cn/xwdt/xnyw/'
}   