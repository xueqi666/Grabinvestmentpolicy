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
    let str = $('.flfg_02 script').text();
    var regex = /\d+/g; // 匹配一个或多个数字
    var pages = str.match(regex)[0];
   
    // const regex = /createPageHTML\((\d+)/;
    // const match = str.match(regex);
    // let pages = parseInt(match[1]);
    // //--------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)
    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(url)
            } else {
                let url1 = url.replace(/.shtml/, `_${i + 1}.shtml`)
    
                urlList.push(url1)
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
    $('.flfg_038-01 a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            urlList.push('https://dofcom.hainan.gov.cn'+urlaa)
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


        let title = $('.xxgk-syxl-t p').eq(0).text().trim().split('：')[1].trim()
        // let str = $('.toolbar').text().trim();
        // var startIndex = str.indexOf('var str_1 = "') + 'var str_1 = "'.length;
        // var endIndex = str.indexOf('";', startIndex);
        // var str_1 = str.substring(startIndex, endIndex).split(' ')[0];
        // // 创建一个正则表达式模式，用于匹配数字
        // var regex = /\d+/g;
        let publish_date = $('.xxgk-syxl-t span').eq(-3).text().split('：')[1].split('  ')[0].split('-').join('.')
        let author = $('.xxgk-syxl-t span').eq(2).text().split('：')[1]
        let content = $('ucapcontent').html()

        let digest = $('ucapcontent').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('ucapcontent').find('img');
        if (imgs.length > 0) {
            img_exist = 1;
        }



        // console.log(digest);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}
// t1('https://dofcom.hainan.gov.cn/dofcom/0503/list.shtml')
// t2('https://dofcom.hainan.gov.cn/dofcom/0503/list.shtml')
// t3('https://dofcom.hainan.gov.cn/dofcom/0503/202109/822e2d4c0de14c0d885de94782c9a28f.shtml?ddtab=true')

module.exports = {
    t1,
    t2,
    t3,
    location: '海南省',
    tag: "政策文件",
    homeUrl: 'https://dofcom.hainan.gov.cn/dofcom/0503/list.shtml'
}   