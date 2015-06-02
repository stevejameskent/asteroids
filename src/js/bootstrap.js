'use strict';

// Globally bootstrap Pixi
global.PIXI = require('pixi.js');
global.Constants = require('./constants');

var Collision = require('./collision');
global.detectCollision = Collision.detectCollision;
global.detectCollisionAxis = Collision.detectCollisionAxis;

require('./asteroids');