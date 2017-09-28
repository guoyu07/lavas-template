/**
 * @file server.js
 * @author lavas
 */

'use strict';

const LavasCore = require('./lib');
const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');

process.env.MODE = 'sf';

let port = process.env.PORT || 3001;
let core = new LavasCore(__dirname);

core.init('development', true)
    .then(() => core.build())
    .then(() => {
        app.use(cors());
        app.use(core.koaMiddleware());
        app.listen(port, () => console.log('server started at localhost:' + port));
    }).catch(err => {
        core.close();
        console.log(err);
    });
