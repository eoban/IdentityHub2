const mongoose = require('mongoose');
const seed = require('../config/dataSeed');
const timers = require('timers');

//drop without fail if db does not exist
function verifyAndDropCollection(modelName) {
    return new Promise(function (resolve, reject) {
        dropCollection(modelName).then(function () { resolve(true) }).catch(function () { resolve(true) });
    });
}

function allWait(promises) {
    return new Promise(function (resolve, reject) {
        Promise.all(
            promises.map(p => p.catch(error => error))
        ).then(function (result) {
            var err = null;
            result.forEach(function (item) {
                if (item && item.errors) {
                    err = item;
                }
            });
            if (!err) { resolve(true); } else { reject(err); }
        });

    });
}

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
            resolve(true);
        });
    });
}

seedCollection = function (collectionName) {
    return allWait(
        seed.data[collectionName].map(function (record) {
            let schema = seed.collections[collectionName];
            return new Promise(function (resolve, reject) {
                new schema(record.data).save(
                    function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    }
                )
            });
        }));
}

reseedCollection = function (collectionName) {
    return new Promise(function (resolve, reject) {
        verifyAndDropCollection(collectionName).then(function () {
            seedCollection(collectionName).then(function () { resolve(true) })
                .catch(reject);
        });
    });
}

reseedDatabase = function () {
    var entries = Object.keys(seed.data);
    return allWait(entries.map(function (entry) {
        return reseedCollection(entry);
    }));
}


seedRelation = function (collectionName, record, relation) {
    return new Promise(function (resolve, reject) {
        seed.collections[relation.child.schema].find()
            .where(relation.child.key)
            .in(relation.child.queries)
            .then(function (cdata, cerr) {
                seed.collections[collectionName]
                    .findOne().where(relation.key)
                    .equals(record.data[relation.key])
                    .then(function (pdata, perr) {
                        if (pdata[relation.field] && pdata[relation.field].push) {
                            cdata.forEach(function (oneRec) {
                                pdata[relation.field].push(oneRec._id);
                            });
                        }
                        else {
                            pdata[relation.field] = cdata[0]._id;
                        }
                        pdata.save(function (err, data) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(true);
                        });
                    });
            }).catch(reject);
    });
}
seedRecordRelations = function (collectionName, record) {
    return allWait(
        record.relations.map(function (item) {
            return seedRelation(collectionName, record, item)
        })
    );
    return Promise.resolve(true);
}

seedRelations = function (collectionName) {
    return allWait(
        seed.data[collectionName].map(function (record) {
            return seedRecordRelations(collectionName, record);
        })
    );
}

reseedRelations = function () {
    var entries = Object.keys(seed.data);
    return allWait(entries.map(function (entry) {
        return seedRelations(entry);
    }));

}

module.exports = function () {
    return new Promise(function (resolve, reject) {
        reseedDatabase().then(function () {
            reseedRelations().then(function () { resolve(true); }).catch(reject);
        }).catch(reject);
    });
}