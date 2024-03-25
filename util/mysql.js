const mysql = require('mysql2');


const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'abc123',
    database: 'websiteDataCapture',
    connectionLimit: 10,  // 连接池最大连接数
});

// const pool = mysql.createPool({
//     host: '192.168.3.33',
//     user: 'root',
//     password: 'abc123',
//     database: 'website',
//     connectionLimit: 10,  // 连接池最大连接数
// });

module.exports = pool