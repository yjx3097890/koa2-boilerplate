/**
 * Created by jixianyan on 2017/5/26.
 */
'use strict';

import test from 'ava';
import { user1 } from './data/_userData';
const Server = require('../src/core/Server');
let userService;
test.before('start server', async function () {

    const server = new Server();
    await server.connectDB();

    userService = require('../src/service/userService');
});


test.beforeEach('prepare Data', async function (t) {
    const User = process.core.db.models.User;
    await User.truncate();

});

test('create user', async function (t) {

    let dbUser = await userService.create(user1);
     t.is(dbUser.username, user1.username);
});


