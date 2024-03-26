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
    let str = $('#page_div script').eq(1).text()
    var pattern = /\d+/g
    var pages =  parseInt(str.match(pattern)[1]);



    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)

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
    var pattern = /^(https?:\/\/[^\/]+)/;
    var match = url.match(pattern);
    url1 = match[1]
    //------
    $('.flfg_038-01 a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            if (!urlaa.includes('http')) {
                urlaa = url1 +'/ywdt/jrdf/'+ urlaa
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


        let title = $('.zx-xxxqy h2').text().trim()
        let publish_date = $('.ty-p1 span').eq(1).text().trim().split('：')[1].split(' ')[0].split('-').join('.')
        let author = $('.ty-p1 span').eq(0).text().trim().split('：')[1]

        let content = $('.zx-xxxqy-nr').text()

        let str = $('.zx-xxxqy-nr').text().trim().slice(0, 100)

        let digest = str.replace(/[\r\n\s]+/g, "");
        let img_exist = 0;
        let imgs = $('.zx-xxxqy-nr').find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }


        return { title, author, digest, content, publish_date, img_exist }
        // console.log(img_exist);
        //  
    } catch (error) {
        console.log(error);
    }



}

// t1('https://dongfang.hainan.gov.cn/ywdt/jrdf/')
// t2('https://dongfang.hainan.gov.cn/ywdt/jrdf/index_24.html')

t3('https://dongfang.hainan.gov.cn/ywdt/jrdf/202311/t20231123_3533169.html')
module.exports = {
    t1,
    t2,
    t3,
    location: '海南省-东方市',
    tag: "新闻动态",
    homeUrl: 'http://dongfang.hainan.gov.cn/ywdt/jrdf/'
}   