const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

async function getFiles() {
    const folderPath = './爬取省市';
    const files = await readdir(folderPath, { withFileTypes: true });

    let fileUrls = [];
    for (const file of files) {
        const fileName = file.name;
        const filePath = path.join(folderPath, fileName);

        if (file.isFile()) {
            fileUrls.push(fileName);
        } else if (file.isDirectory()) {
            console.log('文件夹：', fileName);
            const subFiles = await readdir(filePath, { withFileTypes: true });
            for (const subFile of subFiles) {
                const subFileName = subFile.name;
                const subFilePath = path.join(filePath, subFileName);
                fileUrls.push(subFileName);
            }
        }
    }

    return fileUrls;
}

// async function executeCommand(filePath) {
//     const command = `node index.js ./爬取省市/${filePath}`;
//     return new Promise((resolve, reject) => {
//         const childProcess = exec(command);

//         let stdout = '';
//         let stderr = '';

//         childProcess.stdout.on('data', data => {
//             stdout += data;
//         });

//         childProcess.stderr.on('data', data => {
//             stderr += data;
//         });

//         childProcess.on('close', code => {
//             if (code === 0) {
//                 resolve(stdout);
//             } else {
//                 reject(new Error(stderr));
//             }
//         });

//         // 设置超时机制
//         setTimeout(() => {
//             childProcess.kill();
//             reject(new Error('Command execution timed out'));
//         }, 60000); // 60秒超时
//     });
// }
async function executeCommand(filePath) {
    console.log(`Start executing command for file ${filePath} at ${new Date().toISOString()}`);

    const command = `node index.js ./爬取省市/${filePath}`;
    return new Promise((resolve, reject) => {
        const childProcess = exec(command);

        let stdout = "";
        let stderr = "";

        childProcess.stdout.on("data", data => {
            stdout += data;
        });

        childProcess.stderr.on("data", data => {
            stderr += data;
        });

        childProcess.on("close", code => {
            if (code === 0) {
                console.log(`Finish executing command for file ${filePath} at ${new Date().toISOString()}`);
                resolve(stdout);
            } else {
                console.error(`Error executing command for file ${filePath}: ${stderr}`);
                reject(new Error(stderr));
            }
        });

        // 设置超时机制
        setTimeout(() => { 
            childProcess.kill();
            console.error(`Command execution timed out for file ${filePath}`);
            reject(new Error("Command execution timed out"));
        }, 60000); // 60秒超时
    });
}


async function executeInParallel() {
    try {
        const fileUrls = await getFiles();
        console.log(fileUrls);

        const concurrency = 20; // 并发执行的线程数
        const promises = [];
        let index = 0;

        const executeNext = async () => {
            if (index >= fileUrls.length) {
                return;
            }

            const currentFileUrl = fileUrls[index];
            index++;

            try {
                const result = await executeCommand(currentFileUrl);
                console.log(result);
            } catch (error) {
                console.error(error);
            }

            await executeNext(); // 递归调用执行下一个任务
        };

        // 同时执行初始的concurrency个任务
        for (let i = 0; i < concurrency; i++) {
            promises.push(executeNext());
        }

        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    }
}


executeInParallel();
