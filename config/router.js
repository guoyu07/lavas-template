/**
 * @file router
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

'use strict';

module.exports = {

    /**
     * route rewrite rules
     *
     * example:
     * ```javascript
     * [{from: '/from/detail/:id', to: '/to/detial/:id'}]
     * ```
     *
     * @type {Array.<Object>}
     */
    rewrite: [
        // {from: /^\/(detail.*)$/, to: '/rewrite/$1'},
        // {from: '/detail/:id', to: '/rewrite/detail/:id'}
    ],

    /**
     * global route path alias
     *
     * usage: [
     *     {
     *         name: 'xx',
     *         prefix: '/your/global/prefix'
     *     },
     *     '/anothor/global/frefix'
     * ]
     *
     * @type Array<Object | string>
     */
    alias: [
        {
            name: 'sf',
            prefix: '/sf_lavas'
        }
    ],

    routes: [
        {
            pattern: '/detail/:id',
            // path: '/rewrite/detail/:id',
            meta: {
                keepAlive: true
            }
        }
    ]
};
