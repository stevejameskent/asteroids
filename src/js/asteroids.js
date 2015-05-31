'use strict';

global.Stage = require('./entities/stage');
var Point = require('./entities/point');
var Projectile = require('./entities/projectile');
var Rectangle = require('./entities/rectangle');
var Triangle = require('./entities/triangle');

var ROTATION_SPEED = .042;
var BASE_ACCELERATION = .12;
var BASE_PROJECTILE_SPEED = 5;
var MAX_SPEED = 15;
var MAX_PROJECTILE_DISTANCE = 650;

var server_ip_address = "asteroids-cherrycoke.rhcloud.com/";
// var server_port = OPENSHIFT_NODEJS_PORT || 8080;

var jetOn = false;
var rotate = 'none';

var projectiles = [];
var projectileTexture = PIXI.Texture.fromImage("resources/images/bullet.png", true);

document.onkeydown = function(e) {
    if (e.keyCode === 38) {
        jetOn = true;
    }
    if (e.keyCode === 39 && rotate !== 'left') {
        rotate = 'right';
    }
    if (e.keyCode === 37 && rotate !== 'right') {
        rotate = 'left';
    }
};

document.onkeyup = function(e) {
    if (e.keyCode === 38) {
        jetOn = false;
    }
    if (e.keyCode === 39 && rotate !== 'left') {
        rotate = 'none';
    }
    if (e.keyCode === 37 && rotate !== 'right') {
        rotate = 'none';
    }
    if (e.keyCode === 32) {
        var projectile = new Projectile(projectileTexture);
        projectiles.push(projectile);
    }
};

var calcAcceleration = function(angle) {
    var accelerationX = BASE_ACCELERATION * Math.cos(angle);
    var accelerationY = BASE_ACCELERATION * Math.sin(angle);

    return {
        'accelerationX': accelerationX,
        'accelerationY': accelerationY
    };
};

var speedX = 0;
var speedY = 0;

requestAnimationFrame(animate);

// Largest asteroid 
// Aspect ratio (H/W)
// 1.11773
var asteroidWidthRatio = .2 / 2;
var asteroidTexture1 = PIXI.Texture.fromImage("resources/images/asteroid1@2x.png", true, PIXI.scaleModes.LINEAR);
var width = Stage.width * asteroidWidthRatio;
var height = width / 1.11773;
var asteroid1 = new Rectangle(asteroidTexture1, 0.5, 0.5, 50, 50, width, height);
asteroid1.sprite.resolution = 4;

// Second largest asteroid
// Aspect ratio (H/W)
// 1.048338
asteroidWidthRatio = .1;
var asteroidTexture2 = PIXI.Texture.fromImage("resources/images/asteroid2.png", true, PIXI.scaleModes.NEAREST);
width = Stage.width * asteroidWidthRatio;
height = width / 1.048338;
var asteroid2 = new Rectangle(asteroidTexture2, 0.5, 0.5, 350, 100, width, height);

// Smallest asteroid
// Aspect ratio (H/W)
// 1.128
var asteroidTexture3 = PIXI.Texture.fromImage("resources/images/asteroid3.png", true, PIXI.scaleModes.NEAREST);
var asteroid3 = new Rectangle(asteroidTexture3, 0.5, 0.5, 250, 150, 30, (30 / 1.048338));

var asteroidList = [asteroid1, asteroid2, asteroid3];

// Player aspect ratio (H/W)
// 1.33075
var texture = PIXI.Texture.fromImage("resources/images/player.png", true);
var textureJet = PIXI.Texture.fromImage("resources/images/playerjet.png", true, PIXI.scaleModes.NEAREST);
var player = new Triangle(texture, 0.5, 0.6, Stage.width / 2, Stage.height / 2, 60, 60 / 1.33075);
var playerRight = new Triangle(texture, 0.5, 0.6, Stage.width / 2, Stage.height / 2, 60, 60 / 1.33075);
var playerLeft = new Triangle(texture, 0.5, 0.6, Stage.width / 2, Stage.height / 2, 60, 60 / 1.33075);
var playerTop = new Triangle(texture, 0.5, 0.6, Stage.width / 2, Stage.height / 2, 60, 60 / 1.33075);
var playerBottom = new Triangle(texture, 0.5, 0.6, Stage.width / 2, Stage.height / 2, 60, 60 / 1.33075);

player.sprite.tint = playerRight.sprite.tint = playerLeft.sprite.tint = playerTop.sprite.tint = playerBottom.sprite.tint = 16777215;

function animate() {
    requestAnimationFrame(animate);
    
    if (jetOn) {
        player.sprite.texture = textureJet;
        playerRight.sprite.texture = textureJet;
        playerLeft.sprite.texture = textureJet;
        playerTop.sprite.texture = textureJet;
        playerBottom.sprite.texture = textureJet;

        var magnitudes = calcAcceleration(player.sprite.rotation - (0.5 * Math.PI));
        speedX += magnitudes.accelerationX;
        speedY += magnitudes.accelerationY;
    } else {
        player.sprite.texture = texture;
        playerRight.sprite.texture = texture;
        playerLeft.sprite.texture = texture;
        playerTop.sprite.texture = texture;
        playerBottom.sprite.texture = texture;
    }

    if (player.sprite.rotation > 2 * Math.PI) {
        player.sprite.rotation -= 2 * Math.PI;
    }
    if (player.sprite.rotation < 0) {
        player.sprite.rotation += 2 * Math.PI;
    }

    if (rotate === 'right') {
        player.sprite.rotation += ROTATION_SPEED;
        playerRight.sprite.rotation = player.sprite.rotation
        playerLeft.sprite.rotation = player.sprite.rotation
        playerTop.sprite.rotation = player.sprite.rotation
        playerBottom.sprite.rotation = player.sprite.rotation    
    }
    if (rotate === 'left') {
        player.sprite.rotation -= ROTATION_SPEED;
        playerRight.sprite.rotation = player.sprite.rotation
        playerLeft.sprite.rotation = player.sprite.rotation
        playerTop.sprite.rotation = player.sprite.rotation
        playerBottom.sprite.rotation = player.sprite.rotation
    }

    if (speedX > MAX_SPEED) {
        speedX = MAX_SPEED;
    }
    if (speedX < -1 * MAX_SPEED) {
        speedX = -1 * MAX_SPEED;
    }
    if (speedY > MAX_SPEED) {
        speedY = MAX_SPEED;
    }
    if (speedY < -1 * MAX_SPEED) {
        speedY = -1 * MAX_SPEED;
    }

    player.sprite.position.x += speedX;
    player.sprite.position.y += speedY;

    if (player.sprite.position.x > 1024) {
        player.sprite.position.x -= 1024;
    }
    if (player.sprite.position.x < 0) {
        player.sprite.position.x += 1024;
    }
    if (player.sprite.position.y < 0) {
        player.sprite.position.y += 768;
    }
    if (player.sprite.position.y > 768) {
        player.sprite.position.y -= 768
    }

    playerRight.sprite.position.x = player.sprite.position.x - 1024;
    playerRight.sprite.position.y = player.sprite.position.y;
    playerLeft.sprite.position.x = player.sprite.position.x + 1024;
    playerLeft.sprite.position.y = player.sprite.position.y;
    playerTop.sprite.position.x = player.sprite.position.x;
    playerTop.sprite.position.y = player.sprite.position.y - 768;
    playerBottom.sprite.position.x = player.sprite.position.x;
    playerBottom.sprite.position.y = player.sprite.position.y + 768;

    for (var k = 0; k < projectiles.length; k++) {
        projectiles[k].sprite.tint = 16777215;
    }

    // Calculate collisions
    var newTint = 16777215;
    for (var j = 0; j < asteroidList.length; j++) {
        if (player.detectCollision(asteroidList[j])) {
            newTint = 0x9E0500;
            asteroidList[j].sprite.tint = 0x9E0500;
        } else {
            asteroidList[j].sprite.tint = 16777215;
        }

        for (k = 0; k < projectiles.length; k++) {
            if (projectiles[k].detectCollision(asteroidList[j])) {
                projectiles[k].sprite.tint = 0x9E0500;
            }
        }
    }

    player.sprite.tint = newTint;

    // Calculate player projectiles
    for (var i = 0; i < projectiles.length; i++) {
        var currentProjectile = projectiles[i];
        if (currentProjectile.totalDistance < MAX_PROJECTILE_DISTANCE) {
            currentProjectile.sprite.position.x += currentProjectile.speedX;
            currentProjectile.sprite.position.y += currentProjectile.speedY;
            currentProjectile.totalDistance += currentProjectile.calcDistance();

            if (currentProjectile.sprite.position.x > 1024) {
                currentProjectile.sprite.position.x -= 1024;
            }
            if (currentProjectile.sprite.position.x < 0) {
                currentProjectile.sprite.position.x += 1024;
            }
            if (currentProjectile.sprite.position.y > 768) {
                currentProjectile.sprite.position.y -= 768;
            }
            if (currentProjectile.sprite.position.y < 0) {
                currentProjectile.sprite.position.y += 768;
            }
        } else {
            Stage.removeEntity(currentProjectile.sprite);
            projectiles.splice(i, 1);
            i -= 1;
        }
    }
    
    Stage.draw();
};