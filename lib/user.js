
"use strict";
/*jslint browser: true, nomen: true*/

var clone = require('clone'),
    Cookie = require('./cookie'),
    clone = require('clone'),
    defaults = require('defaults'),
    extend = require('extend'),
    isEmpty = require('is-empty');


function User(options) {
    this.cookie = new Cookie();
    this.options(options);
    this.id(null);
}

User.prototype.options = function (value) {
    if (arguments.length === 0) {
        return this._options;
    }

    var options = value || {};
    defaults(options, {
        cookie: {
            key: 'trackjs_UserID',
        },
    });

    this._options = options;
};

/**
 * Get or set the user's `id`.
 */
User.prototype.id = function (id) {
    if (arguments.length === 0) {
        return this.cookie.get(this._options.cookie.key);
    }
    this.cookie.set(this._options.cookie.key, id);
};

/**
 * Identity the user with an `id`.
 */
User.prototype.identify = function (id) {
    this.id(id);
};

/**
 * Log the user out, resetting `id` to blank.
 */
User.prototype.logout = function () {
    this.id(null);
    this.cookie.remove(this._options.cookie.key);
};

/**
 * Serializes the User into a hash.
 */
User.prototype.serialize = function () {
    var obj = {};
    if (this.id()) {
        obj.id = this.id();
    }
    return obj;
};


module.exports = User;
