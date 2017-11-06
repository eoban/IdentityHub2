const mongoose = require('mongoose');

const seed = require('../config/dataSeed');
const tables = {
    User: require('./user'),
    Api: require('./api'),
    Client: require('./client'),
    Provider: require('./provider')
};

seedDatabase = function (schemaName, data) {
    data.forEach(function (record) {
        let schema = tables[schemaName];
        new schema(record).save();
    });
}

module.exports = function () {
    var entries = Object.keys(seed);
    entries.forEach(function (entry) {
        dropCollection(entry).then(function () {
            seedDatabase(entry, seed[entry]);
        }, function () {
            seedDatabase(entry, seed[entry]);
        });
    })
}

function dropCollection(modelName) {
            if (!modelName || !modelName.length) {
                Promise.reject(new Error('You must provide the name of a model.'));
            }
            try {
                var model = mongoose.model(modelName);
                var collection = mongoose.connection.collections[model.collection.collectionName];
            } catch (err) {
                return Promise.reject(err);
            }
            return new Promise(function (resolve, reject) {
                collection.drop(function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        }