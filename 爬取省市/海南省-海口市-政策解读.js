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
    let pages = $(".page-box .digg a").eq(-2).text();
    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)

    } else {
        for (let i = 1; i <= pages; i++) {
            if (i === 1) {
                urlList.push(url)
            } else {
                const newUrl = url.replace("1.html", `${i}.html`);
                urlList.push(newUrl)
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
    $('.side-txt-list a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            if (!urlaa.includes('http')) {
                urlaa = url1 + urlaa
            }
            urlList.push(urlaa)
        }
    })

    // console.log(url1);

    //------
    return urlList
}

async function t3(url) {

    try {

        let resHtml = await axios.get(url, axiosOption)
        let $ = cheerio.load(resHtml.data)


        let title = $('.meta h2').text().trim()
        let publish_date = $('.info span').eq(0).text().trim().split('：')[1].split(' ')[0].split('/').join('.')
        let author = $('.info span').eq(1).text().trim().split('：')[1]

        let content = $('.entry').text()

        let digest = $('.entry').text().trim().slice(0, 100)
        let img_exist = 0;
        let imgs = $('.entry').find('img');
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

// t1('https://www.hiipb.com/news/15-1.html')
// t2('https://www.hiipb.com/news/15-1.html')
// t3('https://www.hiipb.com/news/show-24047.html')
module.exports = {
    t1,
    t2,
    t3,
    location: '海南省-海口市',
    tag: "政策解读",
    homeUrl: 'https://www.hiipb.com/news/17-1.html'
}   









