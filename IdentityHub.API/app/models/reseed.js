const mongoose = require('mongoose');

const seed = require('../config/dataSeed');

function dropCollection(modelName) {
    var collection;
    try {
        collection = mongoose.connection.collections[mongoose.model(modelName).collection.collectionName];
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

seedCollection = function (collectionName) {
    return Promise.all(seed.data[collectionName].map(function (record) {
        let schema = seed.collections[collectionName];
        return new Promise(function (resolve, reject) {
            new schema(record).save(function (err, data) {
                resolve();
            })
        });
    }));
}

reseedCollection = function (collectionName) {
    return new Promise(function (resolve, reject) {
        dropCollection(collectionName).then(function () {
            seedCollection(collectionName).then(function (data) {
                resolve();
            })
        }).catch(function (err) { resolve(); });
    });
}

updateRelation = function (entry) {
    return new Promise(function (resolve, reject) {
        seed.collections[entry.childSchema].findOne(entry.childQuery).then(
            function (cdata, cerr) {
                seed.collections[entry.parentSchema].findOne(entry.parentQuery).then(function (pdata, perr) {
                    if (pdata) {
                        pdata[entry.parentField].push(cdata._id);
                        pdata.save(function (err, data) {
                            resolve();
                        });
                    }else{resolve();}
                });
            }).catch(function(err){
                reject(err);
            });
    });
}

updateRelations = function () {
        return Promise.all(seed.relations.map(function (entry) {
            return updateRelation(entry);
        }));
}

module.exports = reseedDatabase = function () {
    return new Promise(function (resolve, reject) {
        var entries = Object.keys(seed.data);
        Promise.all(entries.map(function (entry) {
            return reseedCollection(entry);
        })).then(function () {
            updateRelations().then(function () { resolve(); }).catch(function (err) { resolve(); });
        }).catch(function (err) { 
            resolve();
            updateRelations().then(function () { resolve(); }).catch(function (err) { resolve(); }); 
        });
    });
}