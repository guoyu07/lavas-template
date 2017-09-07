/**
 * @file index.js
 * @author lavas
 */
import {emptyDir} from 'fs-extra';
import RouteManager from './RouteManager';
import Renderer from './Renderer';
import WebpackConfig from './WebpackConfig';
import ConfigReader from './ConfigReader';
import ConfigValidator from './ConfigValidator';

import privateFileFactory from './middlewares/privateFile';
import ssrFactory from './middlewares/ssr';
// import errorFactory from './middlewares/error';

import ora from 'ora';

import connect from 'connect';
import {compose} from 'compose-middleware';
import composeKoa from 'koa-compose';
import c2k from 'koa-connect';
import serve from 'serve-static';

import {emptyDir, copy} from 'fs-extra';
import {join} from 'path';
import privateFile from './middlewares/privateFile';

export default class LavasCore {
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }

    async initBeforeBuild() {
        this.config = await ConfigReader.read(this.cwd, this.env);

        ConfigValidator.validate(this.config);

        this.renderer = new Renderer(this);

        this.webpackConfig = new WebpackConfig(this.config, this.env);

        this.routeManager = new RouteManager(this.config, this.env, this.webpackConfig);
    }

    async build(env = 'development') {
        this.env = env || process.env.NODE_ENV;
        this.isProd = this.env === 'production';

        if (!this.isProd) {
            // in production mode we don't need to run server
            this.app = connect();
        }
        await this.initBeforeBuild();

        let spinner = ora();
        spinner.start();

        // clear dist/
        await emptyDir(this.config.webpack.base.output.path);

        // build routes' info and source code
        await this.routeManager.buildRoutes();

        // add extension's hooks
        if (this.config.extensions) {
            this.config.extensions.forEach(({name, init}) => {
                console.log(`[Lavas] ${name} extension is running...`);
                this.webpackConfig.addHooks(init);
            });
        }

        // webpack client & server config
        let clientConfig = this.webpackConfig.client(this.config);
        let serverConfig = this.webpackConfig.server(this.config);

        // build bundle renderer
        await this.renderer.build(clientConfig, serverConfig);

        if (this.isProd) {
            // store config which will be used in online server
            // await ConfigReader.write
            // compile multi entries only in production mode
            await this.routeManager.buildMultiEntries();
            // store routes info in routes.json for later use
            await this.routeManager.writeRoutesFile();
            await this.copyServerModuleToDist();
        }

        spinner.succeed();
    }

    async runAfterBuild() {
        this.app = connect();

        this.config = await ConfigReader.readJson(this.cwd);

        this.renderer = new Renderer(this);

        this.routeManager = new RouteManager(this.config, this.env);

        // create with routes.json
        await this.routeManager.createWithRoutesFile();
        // create with bundle & manifest
        await this.renderer.createWithBundle();
    }

    /**
     * compose all the middlewares
     *
     * @return {Function} koa middleware
     */
    koaMiddleware() {
        if (this.isProd) {
            // add static middleware
            this.app.use(serve(this.config.webpack.base.output.path));
        }

        // transform express/connect style middleware to koa style
        let transformedMiddlewares = this.app.stack.map(m => c2k(m.handle));

        return composeKoa([
            async function (ctx, next) {
                // koa defaults to 404 when it sees that status is unset
                ctx.status = 200;
                await next();
            },
            c2k(privateFileFactory(this)),
            ...transformedMiddlewares,
            c2k(ssrFactory(this))
        ]);
    }

    expressMiddleware() {
        if (this.isProd) {
            // add static middleware
            this.app.use(serve(this.config.webpack.base.output.path));
        }

        // use middlewares directly
        let middlewares = this.app.stack.map(m => m.handle);

        return compose([
            privateFileFactory(this),
            ...middlewares,
            ssrFactory(this)
        ]);
    }

    /**
     * copy server relatived files into dist when build
     */
    async copyServerModuleToDist() {
        let libDir = join(this.cwd, './lib');
        let distLibDir = join(this.cwd, './dist/lib');
        let serverDir = join(this.cwd, './server.js');
        let distServerDir = join(this.cwd, './dist/server.js');
        let nodeModulesDir = join(this.cwd, 'node_modules');
        let distNodeModulesDr = join(this.cwd, './dist/node_modules');

        await Promise.all([
            copy(libDir, distLibDir),
            copy(serverDir, distServerDir),
            copy(nodeModulesDir, distNodeModulesDr)
        ]);
    }
}
