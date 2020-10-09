require('dotenv').config();

module.exports = {
    development: {
        client: 'pg',
        connection: 'postgres://postgres:2016@postgres_db/visualsupport'
    },
    production: {
        client: 'pg',
        connection: 'postgres://postgres:2016@postgres_db/visualsupport'
    }
};
