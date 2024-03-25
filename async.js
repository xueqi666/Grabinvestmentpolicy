const pool = require('./util/mysql.js');
const pool2 = require('./util/mysql2.js');

async function asyncTest() {
    let flag = new Promise((resolve, reject) => {
        pool.query(`select * from articlecontent limit 11000`, (error, results) => {

            if (error) {
                reject(error);
            } else {
                for (const itme of results) {
                    let { id, title, author, content_source_url, publish_date, tag_type, read_count, postion } = itme
                    tag_type = tag_type.split('-')[1]
                    pool2.query('insert into articlecontent values(?,?,?,?,?,?,?,?)', [id, title, author, content_source_url, publish_date, tag_type, read_count, postion])

                }
            }
        });
    })
}
asyncTest()


