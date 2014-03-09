
"use strict";
/*jslint browser: true, nomen: true*/

var Skybox = require('./skybox'),
    bind  = require('bind'),
    skybox = new Skybox();

skybox.autoinitialize();

module.exports = skybox;

bind(module.exports, module.exports.init);
bind(module.exports, module.exports.initialize);
