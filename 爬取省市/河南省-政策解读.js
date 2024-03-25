const cheerio = require('cheerio');
const axios = require('axios');
let axiosOption = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',

    },
    maxRedirects: 0

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
        if (error.response) {
            // 请求发生重定向时的处理
            let value = error.response.headers['set-cookie'][0].split(';')[0]

            resHtml = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
                    'Cookie': "zh_choose=n; mode=1; yfx_c_g_u_id_10000001=_ck23112815423813986950311106519; speakVolume=100; readStatus=pointRead; batchReadIsOn=false; guidesStatus=off; highContrastMode=defaltMode; cursorStatus=off; magnifierIsOn=false; readZoom=1; percentStatus=100; PointReadIsOn=false; fontZoom=1; speakFunctionIsOn=true; textModeStatus=off; speakSpeed=0; wzaIsOn=false; readScreen=false; yfx_f_l_v_t_10000001=f_t_1701420825724__r_t_1701420825724__v_t_1701424645719__r_c_0;" + value

                }
            })


        } else {
            // 其他错误处理
            console.error(error);
        }
    }

    return resHtml
}
async function t1(url) {

    let resHtml = await t0(url)

    let $ = cheerio.load(resHtml.data)

    //--------
    var pageSize = Number($('#pageDec').attr('pagesize'));
    var pageCount = Number($('#pageDec').attr('pagecount'));
    let pages = 0
    if (pageCount === 0) {
        pages = 1
    } else {
        pages = Math.ceil(pageCount / pageSize)
    }

    // --------
    let urlList = []
    if (pages === 1) {
        urlList.push(`${url}index.html`)

    } else {
        for (let i = 0; i < pages; i++) {
            if (i === 0) {
                urlList.push(`${url}index.html`)
            } else {
                urlList.push(`${url}index_${i + 1}.html`)
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
    var pattern = /^(https?:\/\/[^\/]+)/;
    var match = url.match(pattern);
    url1 = match[1]
    //------
    $('.mt15  a').each((index, element) => {
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

    if (url.includes('henan')) {

        try {

            let resHtml = await t0(url)
            let $ = cheerio.load(resHtml.data)

            let title = $('#title').text().trim()
            let publish_date = $('.td-r:last').text().replace(/(年|月)/g, '.').replace("日", "");
            let author = $('.td-r').eq(2).text().replace(/(年|月)/g, '.').replace("日", "");
            let content = $('.content').html()

            let digest = $('.content').text().replace(/[\r\n\s]+/g, "").slice(0, 100);
            let img_exist = 0;
            let imgs = $('ucapcontent').find('img');
            if (imgs.length > 0) {
                img_exist = 1;
            }

            // console.log(publish_date);
            return { title, author, digest, content, publish_date, img_exist }
        } catch (error) {
            console.log(error);
        }




    } else {
        console.log('不是我需要的链接');
    }



}
// t1('https://www.hainan.gov.cn/hainan/zmgyshj/list_hnzymyg.shtml')
// t2('https://www.hainan.gov.cn/hainan/zcfgqh/list_hnzymyg.shtml')
// t3('https://www.hainan.gov.cn/hainan/zmghnwj/202305/9b10a3ce52a049269ef0f5d37f587370.shtml?ddtab=true')
module.exports = {
    t1,
    t2,
    t3,
    location: '河南省',
    tag: "政策解读",
    homeUrl: 'https://www.henan.gov.cn/zt/2023zt/yhyshjhnjxs/zcjd/'
}   