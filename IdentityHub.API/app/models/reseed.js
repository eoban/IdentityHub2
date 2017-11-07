const mongoose = require('mongoose');

const seed = require('../config/dataSeed');

seedDatabase =  function (schemaName, data) {
    Promise.all(data.map(function(record){
        let schema = seed.collections[schemaName];
        return new schema(record).save();
    }));
    //   data.forEach(function (record) {
    //     let schema = seed.collections[schemaName];
    //     let item = new schema(record);
    //     await item.save();
    // });
}

module.exports = function () {
    var entries = Object.keys(seed.data);
    Promise.all(entries.map(function(entry){
        dropCollection(entry).then(function () {
            return seedDatabase(entry, seed.data[entry]);
        }, function () {
            return seedDatabase(entry, seed.data[entry]);
        });        
    })).then(function(){console.log('done')});
    
    // entries.forEach(function (entry) {
    //     dropCollection(entry).then(function () {
    //         seedDatabase(entry, seed.data[entry]);
    //     }, function () {
    //         seedDatabase(entry, seed.data[entry]);
    //     });
    // });
    // console.log('done now')
    seed.relations.forEach(function (entry) {
        seed.collections[entry.childSchema].findOne(entry.childQuery).then(
            function (cdata, err) {
                seed.collections[entry.parentSchema].findOne(entry.parentQuery).then(
                    function (pdata, err) {
                        if (pdata) {
                            pdata[entry.parentField].push(cdata._id);
                            pdata.save();
                        }
                    });
            });
    });
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