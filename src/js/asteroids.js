'use strict';

global.Stage = require('./entities/stage');

var Input = require('./utils/input');

var Point = require('./entities/shapes/point');
var Rectangle = require('./entities/shapes/rectangle');
var Triangle = require('./entities/shapes/triangle');

var Projectile = require('./entities/projectile');
var Player = require('./entities/player');
var player = new Player(50, 55 / 2);
player.setPosition({x: 25, y: 25});
Input.setupPlayerInput(player);
Stage.addPlayer(player);

var server_ip_address = "asteroids-cherrycoke.rhcloud.com/";
// var server_port = OPENSHIFT_NODEJS_PORT || 8080;

requestAnimationFrame(animate);

// Largest asteroid
// Aspect ratio (H/W)
// 1.11773
var asteroidWidthRatio = .17;
var asteroidTexture1 = PIXI.Texture.fromImage("resources/images/asteroid1.png", true, PIXI.scaleModes.LINEAR);
var width = Stage.width * asteroidWidthRatio;
var height = width / 1.11773;
var asteroid1 = new Rectangle(asteroidTexture1, 0.5, 0.5, .25 * Stage.width, .25 * Stage.height, width, height);

// Second largest asteroid
// Aspect ratio (H/W)
// 1.048338
asteroidWidthRatio = .08;
var asteroidTexture2 = PIXI.Texture.fromImage("resources/images/asteroid2.png", true, PIXI.scaleModes.NEAREST);
width = Stage.width * asteroidWidthRatio;
height = width / 1.048338;
var asteroid2 = new Rectangle(asteroidTexture2, 0.5, 0.5, .75 * Stage.width, .25 * Stage.height, width, height);

// Smallest asteroid
// Aspect ratio (H/W)
// 1.128
asteroidWidthRatio = .02929;
var asteroidTexture3 = PIXI.Texture.fromImage("resources/images/asteroid3.png", true, PIXI.scaleModes.NEAREST);
width = Stage.width * asteroidWidthRatio;
height = width / 1.128;
var asteroid3 = new Rectangle(asteroidTexture3, 0.5, 0.5, .5 * Stage.width, .75 * Stage.height, width, height);

var asteroidList = [asteroid1, asteroid2, asteroid3];

function animate() {
    requestAnimationFrame(animate);

    var playerList = Stage.getPlayerList();
    for (var i = 0; i < playerList.length; i++) {
        playerList[i].step();
    }

    var projectileList = Stage.getProjectileList();
    for (var i = 0; i < projectileList.length; i++) {
        projectileList[i].step();
    }
      
    Stage.draw();
};