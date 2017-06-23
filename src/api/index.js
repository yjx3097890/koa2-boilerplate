'use strict';

const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = module.exports = new Router({
    prefix : '/api'
});


fs.readdirSync(__dirname)
    .filter(function (file) {
        //过滤index和.开头的文件
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file){
        const name = file.split('.')[0];
        const file_path = path.join(__dirname, name);
        const route = require(file_path);
        router.use('/'+name, route.routes(), route.allowedMethods());
    });
