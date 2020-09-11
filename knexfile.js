require('dotenv').config();

module.exports = {
    development: {
        client: 'pg',
        connection: 'postgres://postgres:2016@localhost/visualsupport'
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL + '?ssl=true'
    }
};