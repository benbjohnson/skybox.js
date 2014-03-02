
"use strict";
/*jslint browser: true, nomen: true*/

var Track = require('./track'),
    bind  = require('bind');

module.exports = new Track();

bind(module.exports, module.exports.init);
bind(module.exports, module.exports.initialize);
