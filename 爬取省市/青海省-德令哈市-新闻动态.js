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
        // let str = $(".page").text();
        // const regex = /createPageHTML\((\d+)/;
        // const match = str.match(regex);
        // let pages = parseInt(match[1]);
        //--------
    let pages = $('.p_pages span').eq(-3) .text()
    let urlList = []
    if (pages === 1) {
        urlList.push(url)
     
    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(url)
            } else {
                urlList.push(url.replace(/.htm/,`/${i}.htm`))
            }
        }
 


    }
    // console.log(urlList);
    return urlList
    // console.log(pages);
}

async function t2(url) {
    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    //------
    $('.fr ul #lineu6_0 a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            urlList.push('http://www.delingha.gov.cn/'+urlaa.substring(3))
        }
    })


    //------
    // console.log(urlList);
    return urlList
}

async function t3(url) {

    try {

        let resHtml = await axios.get(url, axiosOption)
        let $ = cheerio.load(resHtml.data)

    
        let title = $('.info header h1').text().trim();
        let author = '德令哈市人民政府'
        let str = $('.info header p ').text().trim();
        var regex = /\d+/g;
        var publish_date = str.match(regex).slice(0,3).join('.');
        let content = $('#vsb_content_4').html()
        let digest =$('#vsb_content_4').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('#vsb_content_4').find('img');
        if (imgs.length > 0) {
            img_exist = 1; 
        }
       
       
        // console.log(img_exist);
        return { title, author, digest, content, publish_date, img_exist }
    } catch (error) {
        console.log(error);
    }



}
// t1("http://www.delingha.gov.cn/zmhd/bdyw.htm")
// t2("http://www.delingha.gov.cn/zmhd/bdyw.htm")
// t3("http://www.delingha.gov.cn/info/1040/111414.htm")

module.exports = {
    t1,
    t2,
    t3,
    location: '青海省-德令哈市',
    tag: "新闻动态",
    homeUrl: 'http://www.delingha.gov.cn/zmhd/bdyw.htm'
}   