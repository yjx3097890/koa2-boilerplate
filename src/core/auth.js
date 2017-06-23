'use strict';

const auth = module.exports = function(role){
    return async function (ctx, next){
        if(ctx.session.user){
            const user = ctx.session.user;

            if (user.role >= role) {
                await next();
            }else {
                ctx.throw(401, '用户权限不足。');
            }

        }else {
            ctx.throw(403, '用户未登录。');
        }
    }
};

auth.admin = 1;
auth.user = 0;

