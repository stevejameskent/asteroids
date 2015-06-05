'use strict';

// Globally bootstrap Pixi
global.PIXI = require('pixi.js');
global.Constants = require('./constants');

var Collision = require('./collision');
global.detectCollision = Collision.detectCollision;
global.detectCollisionAxis = Collision.detectCollisionAxis;

//Polyfill simple prototype inheritance
Object.prototype.inherits = function(target) {
    try {
        var keys = Object.keys(target.prototype);
        for (var i = 0; i < keys.length; i++) {
            this.prototype[keys[i]] = target.prototype[keys[i]];
        }
    } catch (err) {}
};

require('./asteroids');