const mysql = require('mysql2');


const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'abc123',
    database: 'visualmanagement',
    connectionLimit: 10,  // 连接池最大连接数
});



module.exports = pool