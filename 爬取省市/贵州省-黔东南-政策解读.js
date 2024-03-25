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
    let str = $(".page").text();
    const regex = /createPageHTML\((\d+)/;
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
    return urlList


}

async function t2(url) {
    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    //------
    $('.NewsList a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            urlList.push(urlaa)
        }
    })

    console.log('我是第一个');

    //------
    return urlList
}

async function t3(url) {

    try {

        let resHtml = await axios.get(url, axiosOption)
        let $ = cheerio.load(resHtml.data)


        let title = $('.title h1').text()
        let str = $('.toolbar').text().trim();
        var startIndex = str.indexOf('var str_1 = "') + 'var str_1 = "'.length;
        var endIndex = str.indexOf('";', startIndex);
        var str_1 = str.substring(startIndex, endIndex).split(' ')[0];
        // 创建一个正则表达式模式，用于匹配数字
        var regex = /\d+/g;
        let publish_date = str_1.match(regex).join('.');
        let author = '黔东南州投资促进局'
        let content = $('#Zoom').html()

        let digest = $('#Zoom').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('#Zoom').find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }



        // console.log(author);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}



module.exports = {
    t1,
    t2,
    t3,
    location: '贵州省-黔东南',
    tag: "政策解读",
    homeUrl: 'http://tzcj.qdn.gov.cn/zsdt_0/zjdt_5821592/'
}   