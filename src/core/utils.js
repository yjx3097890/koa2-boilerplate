'use strict';
const crypto = require('crypto');
const config = require('../config');

const utils = module.exports;

utils.getProjectRoot = function(){
    const path = require('path');
    return path.join(__dirname,'../../');
};


utils.encryptStr = function (str) {
    if (!str) {
        return '';
    }
    const hmac = crypto.createHmac('sha1', config.pwdKey);
    hmac.update(str);
    return hmac.digest('hex');
};


utils.toObject = function (obj) {
    if (typeof obj  === 'string') {
        return JSON.parse(obj);
    } else {
        return obj;
    }

};

utils.encode = function (str) {
    if (!str) return '';
    const res = [];
    for (let c of str) {
        res.push(c.codePointAt(0));
    }
    return res.join('\'');

};

utils.decode = function (str) {
    if (!str) return '';
    const arr = str.split('\'');
    let res = '';
    for (let c of arr) {
        res += String.fromCodePoint(c);
    }
    return res;
};


utils.randomStr = function(num){

    const strs = [
        0,1,2,3,4,5,6,7,8,9,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
    ];
    let text = '';
    const length = strs.length;
    for (let i=0 ; i < num; i++) {
        let index = parseInt(Math.random() * length);
        text += strs[index];
    }
    return text;
};

utils.parseSpace = function (str) {
    return str.replace(/[ ]+/g, '\\$&');
};

utils.appendQuot = function(str) {
    return '"'+str+'"';
};

if ( require.main === module ) {
    // let a;
    //  console.log(a = utils.encode('!@#$%^&*()的是的范德萨'));
    //  console.log(utils.decode(a));

}
