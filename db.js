const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: '0143',
    database: 'url_database',
    host: 'localhost',
    port: 5432
})

module.exports = pool;