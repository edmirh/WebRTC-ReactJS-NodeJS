const knex = require('./connection');

module.exports = {
    getOne: function (id) {
        return knex('users').where('user_id', id).first();
    },
    getOneByEmail: function(email) {
        return knex('users').where('email', email).first();
    },
    getOneByPhone: function(phone) {
        return knex('users').where('phone', phone).first();
    },
    create: function(user) {
        return knex('users').insert(user, 'id').then(ids => {
            return ids[0];
        })
    }

}