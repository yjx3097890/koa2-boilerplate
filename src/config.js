'use strict';
const path = require('path');

const config = module.exports;
const dbServer = 'localhost';

config.developPort =  8081;
config.port =  80;

config.name =  'temp';


config.dbConfig ={
    dialect   : 'postgres',
    host     : dbServer,
    port     :  5432,
    user     : 'postgres',
    password : '123456',
    database : config.name,
    charset  : 'utf8',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false,
    reCreateDB: false
};
config.dbTestConfig ={
    dialect   : 'postgres',
    host     : dbServer,
    user     : 'postgres',
    password : '123456',
    port     :  5432,
    database : config.name+'-test',
    charset  : 'utf8',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging:false,
    reCreateDB: true
};
config.dbDevelopConfig ={
    dialect   : 'postgres',
    host     : dbServer,
    user     : 'postgres',
    port     :  5432,
    password : '123456',
    database : config.name+'-develop',
    charset  : 'utf8',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: console.log,
    reCreateDB: false
};


config.uploadPath = path.join(__dirname, '../uploads');   //调用文件的相对路径
config.tempPath = path.join(__dirname, '../temp');

config.host = "http://www.shambalavisual.com";

config.sessionKey = ["123456"];


config.pwdKey = 'iloveyou';

config.logPath = path.join(__dirname, '../logs');

config.frontPath = path.join(__dirname, '../public');



