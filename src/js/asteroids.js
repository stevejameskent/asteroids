'use strict';

global.Stage = require('./entities/stage');

var NO_COLLISION_TINT = 16777215;
var COLLISION_TINT = 0x9E0500;

var Input = require('./utils/input');

var Point = require('./entities/shapes/point');
var Rectangle = require('./entities/shapes/rectangle');
var Triangle = require('./entities/shapes/triangle');

var AsteroidSmall = require('./entities/asteroid_small');
var AsteroidMedium = require('./entities/asteroid_medium');
var AsteroidLarge = require('./entities/asteroid_large');
var Projectile = require('./entities/projectile');

var Player = require('./entities/player');
var player = new Player(50, 55 / 2);
Input.setupPlayerInput(player);

var server_ip_address = "asteroids-cherrycoke.rhcloud.com/";
// var server_port = OPENSHIFT_NODEJS_PORT || 8080;

var asteroid1 = new AsteroidLarge(25, 14);
asteroid1.setSpeed(.05, .025);
var asteroid2 = new AsteroidMedium(75, 14);
asteroid2.setSpeed(.08, .1);
var asteroid3 = new AsteroidSmall(50, 42);
asteroid3.setSpeed(-.04, -.07);

requestAnimationFrame(animate);

// var asteroidList = [asteroid1, asteroid2, asteroid3];

function animate() {
    requestAnimationFrame(animate);
    var i, j, k;

    var asteroidList = Stage.getAsteroidList();
    var playerList = Stage.getPlayerList();
    var projectileList = Stage.getProjectileList();

    for (i = 0; i < asteroidList.length; i++) {
        asteroidList[i].step();
        asteroidList[i].setTint(NO_COLLISION_TINT);
    }

    for (i = 0; i < playerList.length; i++) {
        playerList[i].step();
        playerList[i].setTint(NO_COLLISION_TINT);

        for (j = 0; j < asteroidList.length; j++) {
            if (asteroidList[j].detectCollision(playerList[i])) {
                asteroidList[j].setTint(COLLISION_TINT);
                playerList[i].setTint(COLLISION_TINT);
            }
        }
    }

    for (i = 0; i < projectileList.length; i++) {
        projectileList[i].step();
        projectileList[i].setTint(NO_COLLISION_TINT);

        for (j = 0; j < asteroidList.length; j++) {
            if (asteroidList[j].detectCollision(projectileList[i])) {
                asteroidList[j].setTint(COLLISION_TINT);
                projectileList[i].setTint(COLLISION_TINT);
            }
        }
    }

    Stage.draw();
};