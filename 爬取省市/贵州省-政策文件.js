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
// 获取页码函数
async function t1(url) {
    let resHtml = await t0(url)
    let $ = cheerio.load(resHtml.data)

    //--------
    let content = $('.page').text().trim()
    let index = content.indexOf("createPageHTML") + "createPageHTML".length + 1

    let pages = content.substring(index, index + 1)


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
                let url1 = url.replace(/.html/, `_${i}.html`)

                urlList.push(url1)
            }
        }

    }
    // console.log(urlList);
    return urlList


}


//获取每篇文章链接
async function t2(url) {
    let resHtml = await t0(url)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    //------
    $('.xxgkml_list a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {

            if (!urlaa.includes('www.gov.cn')) {
                urlList.push(urlaa)
            }
        }
    })

    console.log(urlList);

    //------
    return urlList
}

//获取每篇文章内容
async function t3(url) {

    try {

        let resHtml = await t0(url)
        let $ = cheerio.load(resHtml.data)


        let title = $('.title').text().trim()


        let str = $('tbody tr').eq(1).text().trim()
        var startIndex = str.indexOf('var str_1 = "') + 'var str_1 = "'.length;
        var endIndex = str.indexOf('";', startIndex);
        var author = str.substring(startIndex, endIndex);
        let publish_date = $('tbody tr:nth-child(2) td:nth-child(4)').text().trim().split(' ')[0].split('-').join('.')

        let content = $('.trs_editor_view').text().trim()





        // console.log(content);
        return { title, author, content, publish_date }
    } catch (error) {
        console.log(error);
    }



}
// t1('https://invest.guizhou.gov.cn/xxgk/xxgkml/zcwj/bmwj/index.html')
// t2('https://invest.guizhou.gov.cn/xxgk/xxgkml/zcwj/bmwj/index.html')
// t3('https://invest.guizhou.gov.cn/xxgk/xxgkml/zcwj/bmwj/202403/t20240305_83886420.html')

module.exports = {
    t1,
    t2,
    t3,
    location: '贵州省',
    tag: "政策文件",
    homeUrl: 'https://invest.guizhou.gov.cn/xxgk/xxgkml/zcwj/bmwj/index.html'
}   