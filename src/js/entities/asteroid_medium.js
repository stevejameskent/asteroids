'use strict';

var Point = require('./shapes/point');
var Rectangle = require('./shapes/rectangle');

var calcAbsolute = require('../utils/math').calcAbsoluteVector;
var texture = PIXI.Texture.fromImage('resources/images/asteroid2.png', true);
var anchorX = 0.5;
var anchorY = 0.5;

// Small asteroid aspect ratio (H / W)
var asteroidAspectRatio = 1.048338;
var dimensions = calcAbsolute(new Point(Constants.ASTEROID_MEDIUM_SIZE, Constants.ASTEROID_MEDIUM_SIZE / asteroidAspectRatio));

var Asteroid = function(relativeX, relativeY, tint) {
    this.relativePos = new Point(relativeX, relativeY);
    this._absolutePos = new Point(relativeX, relativeY);

    this.speed = new Point(0, 0);
    this._container = new PIXI.Container();

    this.setPosition(this.relativePos);

    Rectangle.bind(this)(new PIXI.Sprite(texture), anchorX, anchorY, 0, 0, dimensions.y, dimensions.x);
    this._asteroidLeft = new Rectangle(new PIXI.Sprite(texture), anchorX, anchorY, -1 * Stage.width, 0, dimensions.y, dimensions.x);
    this._asteroidRight = new Rectangle(new PIXI.Sprite(texture), anchorX, anchorY, Stage.width, 0, dimensions.y, dimensions.x);
    this._asteroidTop = new Rectangle(new PIXI.Sprite(texture), anchorX, anchorY, 0, -1 * Stage.height, dimensions.y, dimensions.x);
    this._asteroidBottom = new Rectangle(new PIXI.Sprite(texture), anchorX, anchorY, 0, Stage.height, dimensions.y, dimensions.x);

    this._container.addChild(this.sprite);
    this._container.addChild(this._asteroidLeft.sprite);
    this._container.addChild(this._asteroidRight.sprite);
    this._container.addChild(this._asteroidTop.sprite);
    this._container.addChild(this._asteroidBottom.sprite);

    Stage.addChild(this._container);
    Stage.addAsteroid(this);
};

Asteroid.inherits(Rectangle);

Asteroid.prototype.getPosition = function() {
    return this._container.position;
};

Asteroid.prototype.setPosition = function(position) {
    this.relativePos.x = position.x;
    this.relativePos.y = position.y;

    this._absolutePos.x = position.x;
    this._absolutePos.y = position.y;
    calcAbsolute(this._absolutePos);

    this._container.position.x = this._absolutePos.x;
    this._container.position.y = this._absolutePos.y;
};

Asteroid.prototype.setTint = function(tint) {
    this.sprite.tint = tint;
    this._asteroidLeft.sprite.tint = tint;
    this._asteroidRight.sprite.tint = tint;
    this._asteroidTop.sprite.tint = tint;
    this._asteroidBottom.sprite.tint = tint;
};

Asteroid.prototype.getTint = function(tint) {
    return this.sprite.texture.tint;
};

Asteroid.prototype.setSpeed = function(speedX, speedY) {
    this.speed.x = speedX;
    this.speed.y = speedY;
};

Asteroid.prototype.step = function() {
    /* Calculate new relative position based on velocity vector */
    this.relativePos.x += this.speed.x;
    this.relativePos.y += this.speed.y;

    /* Wrap asteroid position to the edges of the map */
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

Asteroid.prototype.remove = function() {
    Stage.removeChild(this._container);
};

module.exports = Asteroid;
