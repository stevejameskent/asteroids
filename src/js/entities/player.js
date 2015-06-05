'use strict';

var Constants = require('../constants');
var Point = require('./shapes/point');
var Triangle = require('./shapes/triangle');

var calcAbsolute = require('../utils/math').calcAbsoluteVector;

var texture = PIXI.Texture.fromImage("resources/images/player.png", true);
var textureJet = PIXI.Texture.fromImage("resources/images/playerjet.png", true);
var anchorX = 0.5;
var anchorY = 0.6;

// Player aspect ratio (H / W)
var playerAspectRatio = 1.33075;
var dimensions = calcAbsolute(new Point(Constants.PLAYER_SIZE, Constants.PLAYER_SIZE / playerAspectRatio));

var calcAcceleration = function(angle) {
    var accelerationX = +Constants.PLAYER_ACCELERATION * Math.cos(angle);
    var accelerationY = +Constants.PLAYER_ACCELERATION * Math.sin(angle);

    return {
        'accelerationX': accelerationX,
        'accelerationY': accelerationY
    };
};

var Player = function(relativeX, relativeY, tint) {
    this.relativePos = new Point(relativeX, relativeY);
    this._absolutePos = new Point(relativeX, relativeY);

    this.speed = new Point(0, 0);
    this.jet = false;
    this.rotation = 'none';
    this._container = new PIXI.Container;

    this.setPosition(this.relativePos);

    Triangle.bind(this)(new PIXI.Sprite(texture), anchorX, anchorY, 0, 0, dimensions.x, dimensions.y);
    this._playerLeft = new Triangle(new PIXI.Sprite(texture), anchorX, anchorY, -1 * Stage.width, 0, dimensions.x, dimensions.y);
    this._playerRight = new Triangle(new PIXI.Sprite(texture), anchorX, anchorY, Stage.width, 0, dimensions.x, dimensions.y);
    this._playerTop = new Triangle(new PIXI.Sprite(texture), anchorX, anchorY, 0, -1 * Stage.height, dimensions.x, dimensions.y);
    this._playerBottom = new Triangle(new PIXI.Sprite(texture), anchorX, anchorY, 0, Stage.height, dimensions.x, dimensions.y);

    this._container.addChild(this.sprite);
    this._container.addChild(this._playerLeft.sprite);
    this._container.addChild(this._playerRight.sprite);
    this._container.addChild(this._playerTop.sprite);
    this._container.addChild(this._playerBottom.sprite);

    if (tint) {
        this.setTint(tint);
    }

    Stage.addChild(this._container);
    Stage.addPlayer(this);
};

Player.inherits(Triangle);

Player.prototype.remove = function() {
    Stage.removeChild(this._container);
}

Player.prototype.setTint = function(tint) {
    this.sprite.tint = tint;
    this._playerLeft.sprite.tint = tint;
    this._playerRight.sprite.tint = tint;
    this._playerTop.sprite.tint = tint;
    this._playerBottom.sprite.tint = tint;
};

Player.prototype.getTint = function(tint) {
    return this.sprite.tint;
};

Player.prototype.setSpeed = function(speedX, speedY) {
    this.speed.x = speedX;
    this.speed.y = speedY;
};

Player.prototype.setPosition = function(position) {
    this.relativePos.x = position.x;
    this.relativePos.y = position.y;

    this._absolutePos.x = position.x;
    this._absolutePos.y = position.y;
    calcAbsolute(this._absolutePos);

    this._container.position.x = this._absolutePos.x;
    this._container.position.y = this._absolutePos.y;
};

Player.prototype.getPosition = function() {
    return this._container.position;
};

Player.prototype.setJet = function(jet) {
    this.jet = jet;

    if (!jet) {
        this.sprite.texture = texture;
        this._playerLeft.sprite.texture = texture;
        this._playerRight.sprite.texture = texture;
        this._playerTop.sprite.texture = texture;
        this._playerBottom.sprite.texture = texture;
    } else {
        this.sprite.texture = textureJet;
        this._playerLeft.sprite.texture = textureJet;
        this._playerRight.sprite.texture = textureJet;
        this._playerTop.sprite.texture = textureJet;
        this._playerBottom.sprite.texture = textureJet;
    }
};

Player.prototype.setRotation = function(rotation) {
    this.rotation = rotation;
};

Player.prototype.step = function() {
    /* Reset rotation if it is < -2pi or > 2pi to prevent variable from continuing forever */
    if (this.sprite.rotation > 2 * Math.PI) {
        this.sprite.rotation -= 2 * Math.PI;
    }
    if (this.sprite.rotation < -2 * Math.PI) {
        this.sprite.rotation += 2 * Math.PI;
    }

    /* Calculate new player angle */
    if (this.rotation === 'right') {
        this.sprite.rotation += +Constants.PLAYER_ROTATION_SPEED;
        this._playerRight.sprite.rotation = this.sprite.rotation;
        this._playerLeft.sprite.rotation = this.sprite.rotation;
        this._playerTop.sprite.rotation = this.sprite.rotation;
        this._playerBottom.sprite.rotation = this.sprite.rotation;
    }
    if (this.rotation === 'left') {
        this.sprite.rotation -= +Constants.PLAYER_ROTATION_SPEED;
        this._playerRight.sprite.rotation = this.sprite.rotation;
        this._playerLeft.sprite.rotation = this.sprite.rotation;
        this._playerTop.sprite.rotation = this.sprite.rotation;
        this._playerBottom.sprite.rotation = this.sprite.rotation;
    }

    /* Calculate acceleration and new velocity vectors when jet is on */
    if (this.jet) {
        var magnitudes = calcAcceleration(this.sprite.rotation - (0.5 * Math.PI));
        this.setSpeed(this.speed.x + magnitudes.accelerationX, this.speed.y + magnitudes.accelerationY);
    }

    /* Cap player velocity at Constants.PLAYER_MAX_SPEED */
    if (this.speed.x > +Constants.PLAYER_MAX_SPEED) {
        this.speed.x = +Constants.PLAYER_MAX_SPEED;
    }
    if (this.speed.x < -1 * +Constants.PLAYER_MAX_SPEED) {
        this.speed.x = -1 * +Constants.PLAYER_MAX_SPEED;
    }
    if (this.speed.y > +Constants.PLAYER_MAX_SPEED) {
        this.speed.y = +Constants.PLAYER_MAX_SPEED;
    }
    if (this.speed.y < -1 * +Constants.PLAYER_MAX_SPEED) {
        this.speed.y = -1 * +Constants.PLAYER_MAX_SPEED;
    }

    /* Calculate new relative position based on velocity vector */
    this.relativePos.x += this.speed.x;
    this.relativePos.y += this.speed.y;

    /* Wrap player position to the edges of the map */
    if (this.relativePos.x > +Constants.RELATIVE_X_MAX) {
        this.relativePos.x -= +Constants.RELATIVE_X_MAX;
    }
    if (this.relativePos.x < 0) {
        this.relativePos.x += +Constants.RELATIVE_X_MAX;
    }
    if (this.relativePos.y > +Constants.RELATIVE_Y_MAX) {
        this.relativePos.y -= +Constants.RELATIVE_Y_MAX;
    }
    if (this.relativePos.y < 0) {
        this.relativePos.y += +Constants.RELATIVE_Y_MAX;
    }

    this.setPosition(this.relativePos);
};

Player.prototype.equals = function(player2) {
    if (!this.relativePos.equals(player2.relativePos)) {
        return false;
    }
    if (!this._absolutePos.equals(player2._absolutePos)) {
        return false;
    }
    if (!this.speed.equals(player2.speed)) {
        return false;
    }
    if (this.jet !== player2.jet) {
        return false;
    }
    if (this.rotation !== player2.rotation) {
        return false;
    }

    return true;
};

module.exports = Player;
