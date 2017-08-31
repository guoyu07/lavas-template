/**
 * @file server.js
 * @author lavas
 */

const LavasCore = require('./lib');
const Koa = require('koa');

const app = new Koa();

let port = process.env.PORT || 3000;

(async () => {
    try {
        let core = new LavasCore(__dirname, app);

        await core.init(process.env.NODE_ENV);

        await core.build();

        app.use(core.koaMiddleware.bind(core));

        app.listen(port, () => {
            console.log('server started at localhost:' + port);
        });
    }
    catch (e) {
        console.error(e);
    }
})();