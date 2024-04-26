const fs = require('fs');
const pool = require('../util/mysql');

let date = new Date();
const file = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_policy.txt`;




(async function main() {
    let contentList = await new Promise((res, rej) => {
        pool.query(`SELECT publish_date,tag_type,postion,content FROM article_content where content is not null limit 2000 `, (err, results) => {
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
                await fs.promises.appendFile(file, contentList[i].time + ":" + contentList[i].tag_type + ':' + contentList[i].postion + ':' + contentList[i].text.trim() + '\n')
            }
            if (i === contentList.length - 1) {
                console.log("知识源收集成功");
                process.exit(1)
            }
        } catch (error) {
            console.error('追加内容时出现错误：', error);
            continue
        }

    }

})()


