'use strict';

const sequelize = require('../core/db').sequelize;
const utils = require('../core/utils');
const Sequelize = require('sequelize');

const User = module.exports = sequelize.define('User', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_user_id',
        comment: '主键'
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'uk_user_username',
        comment: '登录用户名'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function (value) {
            if (!value) {
                return ;
            }
            this.setDataValue('password', utils.encryptStr(value));
        },
        field: 'f_user_password',
        comment: '登录密码'
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        field: 'uk_user_email',
        comment: '电子邮箱'
    },
    isChecked: {
        type: Sequelize.BOOLEAN,
        field: 'f_user_is_checked',
        comment: '邮箱是否通过验证',
        defaultValue: false
    },
    name: {
        type: Sequelize.STRING,
        field: 'f_user_name',
        comment: '真实姓名'
    },
    phone: {
      type: Sequelize.STRING,
      field: 'f_user_phone',
      comment: '电话'
    },
    image: {
        type: Sequelize.STRING,
        field: 'f_user_image',
        defaultValue: 'avatar.jpg',
        comment: '头像'
    },
    address: {
        type: Sequelize.STRING,
        field: 'f_user_address',
        comment: '地址'
    },
    idCard: {
        type: Sequelize.STRING,
        field: 'f_user_idCard',
        comment: '身份证号'
    },
    role: {
        type: Sequelize.INTEGER,
        field: 'f_user_role',
        defaultValue: 0,
        comment: '用户角色,0普通用户,1管理员'
      },
    lastLogin: {
        type: Sequelize.DATE,
        field: 'f_user_lastLogin',
        comment: '上次登录时间'
    },
},{
    tableName:'t_user',
    classMethods: {
        associate: function(models) {

        }
    },
    paranoid: false  //惰性删除
});
