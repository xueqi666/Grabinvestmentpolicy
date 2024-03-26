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

    let pages = $('.page-info').text().split('/')[1];


    //--------
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
    //------
    $('.content_list a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {

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

    try {

        let resHtml = await t0(url)
        let $ = cheerio.load(resHtml.data)


        let title = $('.article-title').text().trim()

        let publish_date = $('.article-info span').eq(1).text().split('：')[1].trim().split('-').join('.')
        let author = $('.article-info span').eq(0).text().split('：')[1].trim()
        let content_h = $('.article-details')
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
// t1('http://swj.pds.gov.cn/channels/20091.html')
// t2('http://swj.pds.gov.cn/channels/20091.html')
// t3('http://swj.pds.gov.cn/contents/20091/583224.html')

module.exports = {
    t1,
    t2,
    t3,
    location: '河南省-平顶山市',
    tag: "政策文件",
    homeUrl: 'http://swj.pds.gov.cn/channels/20091.html'
}   