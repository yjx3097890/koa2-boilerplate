'use strict';

const Koa = require('koa');
const path = require('path');

const config = require('../config');
const utils = require('./utils');
const db = require('./db');

module.exports = class Server {

    constructor(name, port) {

        this.name = name;
        this.port = port;
        this.utils = utils;
        this.config = config;
        this.app = new Koa();
        this.debug = process.env.NODE_ENV !== 'production';
        this.db = db;
        process.core = this;
    }

    init() {
        throw new Error(this.name + ' init must be implementation!');
    }

    async run() {
        try {
            await this.connectDB();
            this.prepareData();
            await this.runServer();
        } catch(err) {
            console.error(err.stack);
            this.exit();
        }
    }

    async runServer() {
        await  this.init();
        this.app.listen(this.port);
        console.log(this.name + ' is listening on port ' + this.port);
    }


    static exit() {
        process.exit(1);
    }

    async connectDB() {

        await this.db.loadModels();

    }

    /**
     * body解析
     */
    useBodyParser() {
        const koaBody   = require('koa-body');

        this.app.use(koaBody({
            formidable:{
                uploadDir: this.config.uploadPath,
                maxFieldsSize: 1000 * 1024 * 1024  //限制所有文件大小1G
            },
            strict: false
        }));

    }

    useRequestLogger() {
        const logger = require('koa-logger');
        this.app.use(logger());
    }

    useCookieSession() {

        const session = require('koa-session');

        this.app.keys = this.config.sessionKey;

        const CONFIG = {
            key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
            maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
            overwrite: true, /** (boolean) can overwrite or not (default true) */
            httpOnly: true, /** (boolean) httpOnly or not (default true) */
            signed: true, /** (boolean) signed or not (default true) */
        };

        this.app.use(session(CONFIG, this.app));

    }

    async usePGSession() {
        const session = require('koa-session');
        const PGStore = require('./PGSession');
        this.app.keys = this.config.sessionKey;

        let dbConfig;
        if (this.debug) {
            dbConfig = this.config.dbDevelopConfig;
        } else {
            dbConfig = this.config.dbConfig;
        }

        const pgStore = new PGStore(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`, {
            cleanupTime: 60 * 60 * 1000
        });

        await pgStore.setup();

        const CONFIG = {
            key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
            maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
            overwrite: true, /** (boolean) can overwrite or not (default true) */
            httpOnly: true, /** (boolean) httpOnly or not (default true) */
            signed: true, /** (boolean) signed or not (default true) */
            store: pgStore
        };

        this.app.use(session(CONFIG, this.app));

    }

    useCORS() {
        /*
         *启用跨域ajax
         **/
        const cors = require('kcors');
        this.app.use(cors({
            origin: '*',
            maxAge: '1728000',
            credentials: true,
            methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
            headers: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With', 'sid']
        }));

    }

    useCompress() {

        const compress = require('koa-compress');
        this.app.use(compress({
            threshold: 1024
        }));

    }

    loadStatic() {
        const server = require('koa-static');
        this.app.use(server(this.config.frontPath));
    }

    loadSpaStatic() {

        const spa = require('./spa');

        const routes = ['/front', '', '/login'];//TODO 所有可能的路由


        this.app.use(spa(this.config.frontPath, {
            indexes: ['front.html', 'index.html'],
            routeBases: [ '/front', '/'], //首页路由, 前端路由也必须存在.并都以这个为开头
            routes: routes
        }));

    }

    /**
     * 错误处理放在第一个中间件
     */
    handleError() {
        const errorHandle = require('koa-error');
        this.app.use(errorHandle({
            engine: 'pug',
            template: path.join(this.utils.getProjectRoot(), 'public/error.html')
        }));
    }

    loadRouters() {
        const router = require('../api');
        this.app.use(router.routes());
        this.app.use(router.allowedMethods())
    }

    prepareData() {
        console.warn(this.name + ' has nothing to prepare!');
    }

};

