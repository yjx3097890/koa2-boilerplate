'use strict';

let dbConfig;
if (process.env.NODE_ENV === 'test') {
    dbConfig = require('../config').dbTestConfig;
} else if (process.env.NODE_ENV === 'production') {
  dbConfig = require('../config').dbConfig;
} else {
  dbConfig = require('../config').dbDevelopConfig;
}
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = module.exports;

db.sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, dbConfig);

db.models = {};

db.loadModels = function () {
    const dir = path.join(__dirname,'../models');
    fs.readdirSync(dir)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file){
        const name = file.split('.')[0];
        const file_path = path.join(dir, name);
        db.models[name] = require(file_path);
    });

    Object.keys(db.models).forEach(function (modelName) {
        if (db.models[modelName].hasOwnProperty('associate')) {
            db.models[modelName].associate(db.models);
        }
    });


    return db.sequelize.sync({force: dbConfig.reCreateDB});

};


if (require.main === module) {
    db.loadModels().then(()=> {
        console.log('数据库创建成功.')
    });



}
