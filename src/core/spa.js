'use strict';

const fs = require('fs');
const path_ = require('path');
const mime = require('mime');
const crypto = require('crypto');
const pathToRegexp = require('path-to-regexp');
const server = require('koa-static');


const ONE_DAY = 24 * 60 * 60;
const DEFAULTS = {
    routeBases: ['/'],
    stripSlash: false,
    indexes: ['/index.html'],
    static: {
        maxAge: 60 * ONE_DAY
    }
};

function isDebug() {
    return !process.env.NODE_ENV || process.env.NODE_ENV == 'development'
}

//合并对象
function defaults(a, b) {
    for (let k in b) {
        if (!a.hasOwnProperty(k)) {
            a[k] = b[k]
        }
    }
}

//将route变成正则
function transformRoutes(routes) {
    let k, v;
    for (k in routes) {
        v = routes[k];
        if (typeof v === 'string') {
            routes[k] = new RegExp('^' + v.replace(/\:[^\/]+/g, '([^\/]+)') + '$');
        }
    }
    return routes;
}



module.exports = function(directory, options) {

    options = options || {};
    defaults(options, DEFAULTS);
    let debug = 'debug' in options ? options.debug : isDebug();
    if (debug && !options.static.cacheControl) {
        options.static.cacheControl = 'no-cache'
    }

    const routes = options.routes;
    const serve = server(directory);
    const alias = options.static.alias || {};
    let indexes = options.indexes;
    let routeBases = options.routeBases.map(routeBase => routeBase.replace(/\/$/, ''));
    const stripSlash = options.stripSlash;

    indexes = indexes.map((i) => {
         if (i[0] !== '/') return '/' + i;
         return i;
    });
    const routeBasesPrefix = routeBases.map((routeBase) => new RegExp('^' + routeBase));

    if (routes) {
        transformRoutes(options.routes);
    }


    return async function (ctx, next) {


        let path;

        path = ctx.path;

        // when tail is slash,去掉 /
        if ( path.slice(-1) === '/') {
            // consider as no slash internally
            path = path.slice(0, -1);
            // if need strip slash, do redirect
            if (stripSlash) {
                ctx.status = 301;
                ctx.redirect(path);
                return
            }
        }


        let matched = false;
        if (!routes) {
            matched = true;
        } else {
            for (let r of routes) {
                if (r.test(path)) {
                    matched = true;
                    break;
                }
            }
        }
        if (!matched) {
            // run other middlewares
            await next();
        } else {

            routeBasesPrefix.some((rp, i) => {
                if (rp.test(path)) {
                    ctx.path = indexes[i];
                    return true;
                }
                return false;
            });

            await serve(ctx, next);
        }


    }
};

module.exports.routeCollector = function(routes) {
    routes = routes || {};
    const ret = function(route, handler) {
        if (route[0] != '/') {
            route = '/' + route; // add head slash
        }
        routes[route] = pathToRegexp(route); // clean tail slash
    };
    ret.routes = routes;
    return ret;
};
