const fs = require('fs');
const path = require('path');

let filePath = path.resolve(__dirname, './2024-4-7_policy.txt');

let date = getDate()
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        // 将文件内容按行分割成数组
        const lines = data.split('\n');
        let j = 0; // 行数
        let k = 0; //文件数

        // 输出前15行内容
        for (let i = 100; i < lines.length ; i++) {
            if (j < 15 && k < 10) {
                fs.appendFile(`t1/${date}_${k}.txt`, lines[i], 'utf-8', () => { });
                j++
            } else {
                j = 0;
                k++;
              
            }

        }
    }
})
function getDate() {
    let date = new Date();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDay()).padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;

}