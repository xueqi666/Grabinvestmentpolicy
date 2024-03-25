const cheerio = require('cheerio');
const axios = require('axios');
let axiosOption = {
    headers: {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "_gscu_1736383957=01079581n17a1319; _gscu_464119721=010795823uul8g19; wzws_sessionid=gDExNC45Ni4zNy4xMDmCN2E3NzAzgWY1MjlhM6Blbnu4; JSESSIONID=B78F3D2096025AB3695DF6DF8B232289; _gscbrs_1736383957=1; _gscbrs_464119721=1; undefined=undefined; _gscs_1736383957=017397004x3gjw19|pv:7; _gscs_464119721=01739700k89sjq19|pv:7",
        "Referer": "https://www.kaifeng.gov.cn/viewCmsCac.do?cacId=8a28897b41c403ec0141c41de79800f8",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },

}


// let data ='gwcsCode=undefined&divId=8a28897b41a1a8f10141b9b4525805dapagelist&requestUrl=https://www.kaifeng.gov.cn/viewCmsCac.do&cacId=8a28897b41c403ec0141c41de79800f8&queryString=undefined'

function sleep(time) {
    return new Promise(resolve => {
        let timer = setTimeout(() => {
            clearTimeout(timer || 1000);
            timer = null;
            resolve(0);
        }, time);
    });
}

async function t0(data) {
    sleep(1000)
    let resHtml;
    try {
        resHtml = await axios.post('https://www.kaifeng.gov.cn/getHtmlInDivNormal.do?ajaxform', data, axiosOption)

    } catch (error) {
        console.log('请求发送失败', error.response);
    }

    return resHtml
}
async function t1(data) {

    let resHtml = await t0(data)

    let $ = cheerio.load(resHtml.data)

    //--------
    let regex = /\d+/g
    let str = $('.xin2zuo:last').text()
    let pages = str.match(regex)[2]
    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(url)
    } else {

        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(data)
            } else {
                urlList.push(data + '&offset=' + (i * 30))
            }
        }
        // console.log(newUrl);
    }
    console.log(urlList);
    return urlList
}

async function t2(data) {
    let resHtml = await t0(data)
    let $ = cheerio.load(resHtml.data)
    let urlList = []
    // var pattern = /^(https?:\/\/[^\/]+)/;
    // var match = url.match(pattern);
    // url1 = match[1]

    //------
    $('.xin2zuo[align=right] a').each((index, element) => {
        let urlaa = $(element).attr('href').replace(/^\.\//, '') || '';
        if (urlaa !== '') {
            if (!urlaa.includes('https')) {

                urlaa = 'https://www.kaifeng.gov.cn/' + urlaa

            } else {
                return
            }
            if (!urlaa.includes('www.gov.cn')) {
                urlList.push(urlaa)
            }


        }
        // console.log(urlaa);
    })



    //------
    return urlList
}

async function t3(url) {

    if (url.includes('kaifeng')) {

        try {

            let resHtml = await axios.get(url)
            let $ = cheerio.load(resHtml.data)

            let title = $('.title7').text().trim()
            let publish_date = $('.context tr').eq(2).text().trim().split('：')[3].match(/\d+/g).join('.')
            let author = $('.context tr').eq(2).text().trim().split('：')[1].split(' ')[0]
            let content_h = $('.context tbody')
            let content = content_h.html()

            let digest = content_h.text().replace(/[\r\n\s]+/g, "").slice(0, 100);
            let img_exist = 0;
            let imgs = content_h.find('img');
            if (imgs.length > 0) {
                img_exist = 1;
            }



            console.log(img_exist);
            // return { title, author, digest, content, publish_date, img_exist }
        } catch (error) {
            console.log(error);
        }




    } else {
        console.log('不是我需要的链接');
    }



}

t1('gwcsCode=undefined&divId=8a28897b41a1a8f10141b9b4525805dapagelist&requestUrl=https://www.kaifeng.gov.cn/viewCmsCac.do&cacId=ff8080816fa41abb016fa79c59b50dec&queryString=undefined')


module.exports = {
    t1,
    t2,
    t3,
    location: '河南省-开封市',
    tag: "政策文件",
    homeUrl: 'gwcsCode=undefined&divId=8a28897b41a1a8f10141b9b4525805dapagelist&requestUrl=https://www.kaifeng.gov.cn/viewCmsCac.do&cacId=ff8080816fa41abb016fa79c59b50dec&queryString=undefined'
}   
