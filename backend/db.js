// db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,          // sa
    password: process.env.DB_PASSWORD,  // mật khẩu sa
    server: process.env.DB_SERVER,      // localhost
    database: process.env.DB_NAME,      // CinemaDB
    port: Number(process.env.DB_PORT),  // 1433
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// tạo 1 pool duy nhất, dùng lại nhiều lần
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ SQL Server connected');
        return pool;
    })
    .catch(err => {
        console.error('❌ SQL connection error:', err);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};
