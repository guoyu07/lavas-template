/**
 * @file server.express.js
 * @author lavas
 */

const LavasCore = require('lavas-core');
const express = require('express');
const app = express();

let port = process.env.PORT || 3000;

let core = new LavasCore(__dirname);

core.init('development', true).then(() => {
    return core.build();
}).then(() => {
    app.use(core.expressMiddleware());

    app.listen(port, () => {
        console.log('server started at localhost:' + port);
    });
}).catch((err) => {
    console.log(err);
});

// catch promise error
process.on('unhandledRejection', (err, promise) => {
    console.log('in unhandledRejection')
    console.log(err);
    // cannot redirect without ctx!
});
