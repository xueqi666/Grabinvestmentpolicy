
if (false || false) {
    console.log('verdadeiro')
} else {
    console.log('falso')
}

const timestamp = 1617226800000; // 表示 2024-04-01 的时间戳
const date3 = new Date(timestamp);

console.log(Date.now());

function compareDate(start, end) {
    if (start && end) {
        let startTime = new Date(start).getTime();
        let endTime = new Date(end).getTime();
        if (startTime > endTime) {
            return [end, start]
        } else {
            return [start, end]
        }

    
    }
}
console.log(compareDate('2024-04-11', "2024-04-08"));

const { error } = require('console');
const fs = require('fs');

let file = 'a.txt1'

fs.appendFile(file, "edd", (error) => { 
    console.log(error);
})
console.log(fs.readFileSync(file));
