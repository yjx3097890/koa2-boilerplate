'use strict';

const User = process.core.db.models.User;
const utils = process.core.utils;
const toObject = process.core.utils.toObject;
const sequelize = process.core.db ? process.core.db.sequelize : require('../core/db').sequelize;

const userService = module.exports;

userService.create = function (user) {
    return User.create(user);
};

/**
 * 批量新建用户
 * @param users
 * @returns {Promise.<Array.<Instance>>}
 */
userService.createAll = function* (users) {
    return User.bulkCreate(users);
};

/**
 *
 * @param where 判断条件
 * @param user  创建的用户
 * @param useTransact 是否用事务，慢！
 * @returns {Promise.<Instance, created>} .spread((function(user, created){})
 */
userService.findOrCreate = function (where , user, useTransact) {
    if (useTransact) {
        return User.findOrCreate({where: where, defaults: user});
    } else {
        return User.findCreateFind({where: where, defaults: user});
    }
};

/**
 *
 * @param id
 * @param options  参见http://docs.sequelizejs.com/en/latest/api/model/#findalloptions-promisearrayinstance
 * @returns {*}
 */
userService.getById = function (id) {
    return User.findById(id);
};


userService.updateById = function* (id, user) {
    let dbUser = yield userService.getById(id);
    return yield dbUser.update(user,
        {fields: ['username', 'email', 'isChecked', 'name', 'phone', 'image', 'address']});

};

userService.getByUsername = function (username) {
    return User.findOne({
        where: {username: username}
    });
};


/**
 * 专门改password
 * @param id
 * @param user
 * @returns {*}
 */
userService.updatePasswordByIdAndPwd = function* (id, oldPassword, newPassword) {
    let dbUser = yield userService.getById(id);
    if (dbUser.password === utils.encryptStr(oldPassword)) {
        return dbUser.update({password: newPassword}, {fields: ['password']});
    } else {
        return Promise.resolve({ok: false, error: 'OLDERROR'});
    }

};

/**
 *
 * @param id
 * @returns {*}
 */
userService.deleteById = function* (id) {
    let dbUser = yield userService.getById(id);
    return dbUser.destroy();
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
userService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = toObject(args.attributes);
    var where = toObject(args.where || {});
    var offset = toObject(args.offset || 0);
    var limit = toObject(args.limit);
    var order = toObject(args.order || [['f_user_name']]);
    var include = toObject(args.include);
    return User.all(
        {
            attributes: attributes,
            where: where,
            offset: offset,
            limit: limit,
            order: order,
            include: include
        }
    );
};


userService.userTotal = function (option) {
    return User.count(option);
};


/**
 *
 * @param username
 * @param password
 */
userService.login = function* (username, password) {
    let dbUser = yield userService.getByUsername(username)
    if (!dbUser) {
        return {ok: false, message: 'NOEXIST'};
    } else if (dbUser.password === utils.encryptStr(password)) {
        return {ok: true, user: dbUser};
    } else {
        return {ok: false, message: 'ERROR'};
    }

};

userService.registerLogin = function* (id) {
    const dbUser = yield userService.getById(id);
    return yield dbUser.update({lastLogin: Date()});

};




