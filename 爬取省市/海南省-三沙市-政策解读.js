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
    let str = $('div.fany').prev('script').text()
    var pattern = /(\d+)/;
    var match = str.match(pattern);
    let pages = parseInt(match[0]);
    
    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)

    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(url)
            } else {
                const newUrl = url.replace(".shtml", `_${i + 1}.shtml`);
                urlList.push(newUrl)
            }
        }
    }

    return urlList
    // console.log(urlList);
}

async function t2(url) {
    let resHtml = await axios.get(url, axiosOption)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    var pattern = /^(https?:\/\/[^\/]+)/;
    var match = url.match(pattern);
    url1 = match[1]
    //------
    $('.cen-div-1 a').each((index, element) => {
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


        let title = $('.title_cen').text().trim()
        let publish_date = $('publishtime').text().trim().split(' ')[0].split('-').join('.')
        let author = $('#ly').text().trim().trim()

        let content = $('ucapcontent').html()

        let str = $('ucapcontent').text().trim().slice(0, 100)

        let digest = str.replace(/[\r\n\s]+/g, "");
        let img_exist = 0;
        let imgs = $('ucapcontent').find('img');
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

// t1('https://www.hainan.gov.cn/hainan/zxjd/list3.shtml')
// t2('https://www.hainan.gov.cn/hainan/zxjd/list3.shtml')

// t3('https://www.hainan.gov.cn/hainan/zxjd/202312/7a297fb6ee1f4e0198e6171a2b0bafe0.shtml?ddtab=true')
module.exports = {
    t1,
    t2,
    t3,
    location: '海南省-三沙市',
    tag: "政策解读",
    homeUrl: 'https://www.hainan.gov.cn/hainan/zxjd/list3.shtml'
}   