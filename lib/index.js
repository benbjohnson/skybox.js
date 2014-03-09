
"use strict";
/*jslint browser: true, nomen: true*/

var Skybox = require('./skybox'),
    bind  = require('bind');

module.exports = new Skybox();

bind(module.exports, module.exports.init);
bind(module.exports, module.exports.initialize);
