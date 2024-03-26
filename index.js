const pool = require('./util/mysql.js');
const args = process.argv.slice(1);

let { t1, t2, t3, location, tag, homeUrl } = require(args[1]);

/**
 * 
 * @param {*} url 入口页的链接 
 */
function sleep(time) {
    return new Promise(resolve => {
        let timer = setTimeout(() => {
            clearTimeout(timer || 1000);
            timer = null;
            resolve(0);
        }, time);
    });
}
async function getListPage(url) {
    let urlPagesList;
    try { urlPagesList = await t1(url) } catch (e) {
        console.log('t1方法返回值有问题' + e);
    }

    return urlPagesList || [];
}

// 获取列表页的详情
async function getListDetail(url) {

    let urlPagesList = await getListPage(url);
    if (urlPagesList.length === 0) {
        console.log('t1方法返回值有问题');
        return
    }
    let urlArticleList = []
    for (let i = 0; i < urlPagesList.length; i++) {
        try {

            urlArticleList = await t2(urlPagesList[i])

        } catch (e) {
            console.log('t2方法返回值有问题' + e);
            return
        }


        for (let j = 0; j < urlArticleList.length; j++) {
            sleep(300)
            let count = await new Promise((resolve, reject) => {
                pool.query(`SELECT COUNT(*) AS count FROM url_article WHERE url = '${urlArticleList[j]}'`, (error, results) => {
                    if (error) {
                        console.error('查询链接失败:', error);
                        resolve(2)
                    } else {
                        resolve(results[0].count)
                    }
                });
            })

            if (count === 0) {
                try {
                    let insertId = await new Promise((resolve, reject) => {
                        pool.query(`insert into url_article(url,postion,tag_type) values('${urlArticleList[j]}','${location}','${tag}')`, (error, results) => {
                            if (error) {
                                console.error('文章链接插入失败:', error);
                                resolve(`第${results.insertId}条，插入失败`)

                            } else {
                                resolve(`以插入第${results.insertId}条`)
                            }
                        });
                    })

                    console.log(insertId);
                } catch (error) {
                    console.log(error);
                    continue
                }


                if (i + 1 === urlPagesList.length && j + 1 === urlArticleList.length) {
                    console.log('最后一页文章链接插入完成');

                    return
                }
            } else {
                console.log(`第${i + 1}页没有新增文章链接`, args[1]);
            }

        }

    }



}



// 获取文章详情
async function getArticleDetail() {

    await pool.query(`select * from url_article where status = 0 && postion ='${location}' && tag_type ='${tag}'`, async (error, results) => {
        console.log('开始查询文章');
        if (error) {
            console.error('查询失败:', error);
            process.exit();

        }
        if (results.length === 0) {
            console.log('没有数据');
            process.exit();

        }
        for (let i = 0; i < results.length; i++) {

            try {
                let url = results[i].url;
                console.log('正在查询第' + results[i].url_id + '个');

                //_____________
                await sleep(300);
                let title, author, digest, content, publish_date, img_exist
                let pdf_exist = 0;
                if (url.includes('pdf')) {

                    pdf_exist = 1
                } else {
                    try {
                        ({ title, author, digest, content, publish_date, img_exist } = await t3(url))
                    } catch (e) {
                        console.log('t3方法返回值有问题' + e);
                        continue
                    }


                }

                let create_time = getCreateDate()
                let postion = results[i].postion
                let tag_type = results[i].tag_type
                let url_id = results[i].url_id

                const insert = `INSERT INTO article_content (title, author,url_id,content,publish_date,tag_type,postion) VALUES (?,?,?,?,?,?,?)`;
                let params = [title, author, url_id, content, publish_date, tag_type, postion]
                let flagSuccess = await new Promise((resolve, reject) => {
                    pool.query(insert, params, (error, results) => {
                        if (error) {
                            console.error('文章插入失败:', error);
                            resolve(false)

                        } else {
                            console.log('插入成功');
                            resolve(true)
                        }
                    });
                })


                if (flagSuccess) {
                    let falg = await new Promise((resolve, rejects) => {
                        pool.query('update url_article set status = 1 where url_id = ' + results[i].url_id, (error, results) => {
                            if (error) {
                                resolve(false)
                            } else {
                                resolve(true)
                            }
                        })
                    })
                    if (falg) {
                        console.log(`第${results[i].url_id}条状态改变成功`);

                    } else {
                        console.log(`第${results[i].url_id}条状态改变失败`);

                    }
                }
                if (i + 1 === results.length) {
                    console.log('所有文章查询完成');
                    pool.end();
                    process.exit();
                }
            } catch (error) {
                console.log('出错了asd', error);
                if (i + 1 === results.length) {
                    console.log('所有文章查询完成');
                    pool.end();
                    process.exit();
                }

                continue
            }
        }

    })

}



function getCreateDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear(); // 获取年份
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 获取月份，需要注意月份从0开始计数，需要+1
    const day = String(currentDate.getDate()).padStart(2, '0'); // 获取日期

    return formattedDate = `${year}.${month}.${day}`; // 格式化日期
}



// t1('http://tzcj.qdn.gov.cn/tzzc_0/')
// t2('http://tzcj.qdn.gov.cn/tzzc_0/')
// t3('http://tzcj.qdn.gov.cn/tzzc_0/202101/t20210104_66014922.html')

// getListDetail('http://tzcj.qdn.gov.cn/tzzc_0/')

// getArticleDetail()


async function executeAsyncTasks() {
    try {
        const result1 = await getListDetail(homeUrl);
        console.log(' ==============================\n' +
            '文章链接已经全部获取\n' +
            ' ==============================\n  ');
        const result2 = await getArticleDetail();
    } catch (error) {
        console.log('哟点小问题');
    }
}
executeAsyncTasks();

