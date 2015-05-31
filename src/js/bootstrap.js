'use strict';

// Globally bootstrap Pixi
global.PIXI = require('pixi.js');
console.log(window.innerWidth);
var Collision = require('./collision');

global.detectCollision = Collision.detectCollision;
global.detectCollisionAxis = Collision.detectCollisionAxis;

require('./asteroids');