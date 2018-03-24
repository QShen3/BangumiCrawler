const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.user ? config.user + ':' + config.password + '@' : ''}${config.host}:${config.port}/${config.db}`, {
    poolSize: 10
}, (err) => {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

require('./bangumi');
require('./crt');
require('./actor');
require('./staff');
require('./episode');

exports = {
    Bangumi: mongoose.model('Bangumi'),
    Crt: mongoose.model('Crt'),
    Actor: mongoose.model('Actor'),
    Staff: mongoose.model('Staff'),
    Episode: mongoose.model('Episode')
}


