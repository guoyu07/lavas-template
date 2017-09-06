/**
 * @file server.js
 * @author lavas
 */

const LavasCore = require('./lib');
const Koa = require('koa');
// const express = require('express');

const app = new Koa();
// const app = new express();

let env = process.env.NODE_ENV;
let port = process.env.PORT || 3000;

(async () => {
    try {
        let core = new LavasCore(__dirname, app);

        await core.init(env);

        if (env === 'development') {
            await core.build();
        }

        await core.run();

        app.use(core.koaMiddleware.bind(core));
        // app.use(core.expressMiddleware.bind(core));

        app.listen(port, () => {
            console.log('server started at localhost:' + port);
        });
    }
    catch (e) {
        console.error(e);
    }
})();
