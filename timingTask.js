const schedule = require('node-schedule');
const { execSync } = require('child_process');


// 每个月执行一次
const job = schedule.scheduleJob('0 0 1 * *', function () {
    let indexPath = 'main.js'

    const command = `node ${indexPath}`;
    console.log(command);

    execSync(command, { stdio: 'inherit' });
});

