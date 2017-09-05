/**
 * @file extensions config
 * @author wangyisheng(wangyisheng@baidu.com)
 */

'use strict';

/* ======== lavas extensions start ======== */
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var globalConfig = require('./globals');
/* ======== lavas extensions end ======== */

module.exports = [
    /* ======== lavas extensions start ======== */
    // 添加appshell
    {
        name: 'appshell',
        init: {
            base: function (webpackConfig) {
                // 找到stylus-loader并且添加options.import
                let setImport = (styleLoaders, path) => {
                    let find = styleLoaders.find(
                        loader => (typeof loader === 'object' && loader.loader === 'stylus-loader')
                    );
                    if (find) {
                        find.options.import = path;
                    }
                };

                let vueLoaders = webpackConfig.module.rules[0].use[0].options.loaders;
                let variablesFilePath = '~@/extensions/appShell/styles/variables.styl';

                setImport(vueLoaders.stylus, variablesFilePath);
                setImport(vueLoaders.styl, variablesFilePath);
            },

            server: function (webpackConfig) {
                // 修改server，为iscroll的服务端增加备用
                if (!webpackConfig.resolve) {
                    webpackConfig.resolve = {
                        alias: {}
                    }
                }
                else if (!webpackConfig.resolve.alias) {
                    webpackConfig.resolve.alias = {};
                }

                webpackConfig.resolve.alias['iscroll/build/iscroll-lite$']
                    = path.resolve(globalConfig.rootDir, 'core/fix-ssr.js');
                webpackConfig.externals = nodeExternals({
                    whitelist: [/\.(css|vue)$/, /iscroll/]
                });
            }
        }
    }
    /* ======== lavas extensions end ======== */
];
