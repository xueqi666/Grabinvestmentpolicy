const schedule = require('node-schedule');
const { execSync } = require('child_process');



// 每分钟的第30秒执行一次
const job = schedule.scheduleJob('0 0 */24 * * *', function () {
    let indexPath = 'main.js'

    const command = `node ${indexPath}`;
    console.log(command);

    execSync(command, { stdio: 'inherit' });
});