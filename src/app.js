'use strict';

const fs = require('fs');
const config = require('./config');
const Server = require('./core/Server');

let port;
if ( process.env.NODE_ENV !== 'production' ) {
    port = config.developPort;
} else {
    port = config.port;
}

const temp = new Server(config.name, port);


temp.prepareData = function () {

    try {
        fs.statSync(config.uploadPath);
    } catch (err) {
        fs.mkdirSync(config.uploadPath);
        console.log('make folder uploads.');
    }
    try {
        fs.statSync(config.tempPath);
    } catch (err) {
        fs.mkdirSync(config.tempPath);
        console.log('make folder temp.');
    }
};

temp.init = async function () {
    this.useRequestLogger();
    this.handleError();
    this.useCompress();
    this.loadSpaStatic();
    this.loadStatic();


    this.useBodyParser();
    await  this.usePGSession();
    this.loadRouters();
};

if (!module.parent) {
    temp.run();
}





