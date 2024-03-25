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
    let str = $('table').find('td.heizi12').closest('tr').eq(27).text().trim()
    var regex = /\d+/g;
    var pages = str.match(regex)[0];
    // const match = str.match(regex);
    // let pages = parseInt(match[1]);
    //--------
    let urlList = []

        for (let i = 1; i <= pages; i++) {
            var regex = /\d+$/;
            var newUrl = url.replace(regex, '');
            urlList.push(newUrl + i)
    }

        return urlList
    

 
}

async function t2(url) {
    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    //------
    $('table[width="99%"] a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '' && urlaa.includes('http')) {
            urlList.push(urlaa)
        }
    })

    // console.log(urlList.length);

    //------
    return urlList
}

async function t3(url) {

    try {

        let resHtml = await axios.get(url, axiosOption)
        let $ = cheerio.load(resHtml.data)


        let title = $('table[width="94%"] tr').eq(0).text().trim()
 
    
        let publish_date = $('table[width="94%"] tr').eq(1).text().trim().split('：')[2].replace(/年|月/g, '.').replace('日', '');
        let author = '海东市人民政府'
        let content = $('.heizi12').eq(2).html()

        let digest = $('.heizi12').eq(2).text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('.heizi12').eq(2).find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }



        // console.log(img_exist);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}

// t1('http://www.haidong.gov.cn/webaspx/view_list.aspx?portalid=1&lmid=39&pages=2')
// t2('http://www.haidong.gov.cn/webaspx/view_list.aspx?portalid=1&lmid=39&pages=1')
// t3('http://www.haidong.gov.cn/html/39/109875.html')
module.exports = {
    t1,
    t2,
    t3,
    location: '青海省-海东市',
    tag: "新闻动态",
    homeUrl: 'http://www.haidong.gov.cn/webaspx/view_list.aspx?portalid=1&lmid=39&pages=1'
}   