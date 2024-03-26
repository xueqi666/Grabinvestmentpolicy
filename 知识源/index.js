const fs = require('fs');
const pool = require('../util/mysql');


(async function main() {
    let contentList = await new Promise((res, rej) => {
        pool.query(`SELECT publish_date,tag_type,postion,content FROM article_content where content is not null`, (err, results) => {
            if (err) {
                console.log(err);
                rej(err);
            } else {
                let contentList = results.map(item => {
                    if (item.content.trim() !== '') {
                        return { postion: item.postion, text: item.content.trim(), tag_type: item.tag_type, time: item.publish_date };
                    }
                });

                res(contentList);

            }
        })
    })
    for (let i = 0; i < contentList.length; i++) {
        try {
            if (contentList[i]) {
                await fs.promises.appendFile("./policy.txt", contentList[i].time + ":" + contentList[i].tag_type + ':' + contentList[i].postion + ':' + contentList[i].text.trim() + '\n')
            }
        } catch (error) {
            console.error('追加内容时出现错误：', error);
            continue
        }

    }

})()
