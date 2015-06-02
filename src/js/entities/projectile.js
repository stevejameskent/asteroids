'use strict';

var Point = require('./shapes/point');

var calcAbsolute = require('../utils/math').calcAbsoluteVector;
var calcRelativeScalar = require('../utils/math').calcRelativeScalar;

var projectileTexture = PIXI.Texture.fromImage("resources/images/bullet.png", true)
var dimensions = calcAbsolute(new Point(Constants.PROJECTILE_SIZE, Constants.PROJECTILE_SIZE));

var calcProjectileSpeed = function(angle) {
    var projectileSpeedX = +Constants.PROJECTILE_SPEED * Math.cos(angle);
    var projectileSpeedY = +Constants.PROJECTILE_SPEED * Math.sin(angle);

    return {
        'projectileSpeedX': projectileSpeedX,
        'projectileSpeedY': projectileSpeedY
    };
};

var Projectile = function(player) {
    this.sprite = new PIXI.Sprite(projectileTexture);

    var projectileSpeeds = calcProjectileSpeed(player.sprite.rotation - (0.5 * Math.PI));
    this.speed = new Point(projectileSpeeds.projectileSpeedX, projectileSpeeds.projectileSpeedY);

    this.relativePos = new Point(0, 0);
    this.relativePos.x = (player.relativePos.x) + (.6 * calcRelativeScalar(player.sprite.height)) * Math.sin(player.sprite.rotation);
    this.relativePos.y = (player.relativePos.y) - (.6 * calcRelativeScalar(player.sprite.height)) * Math.cos(player.sprite.rotation);

    this._absolutePos = new Point(this.relativePos.x, this.relativePos.y);
    this.setPosition(this.relativePos);

    this.totalDistance = 0;

    this.calcDistance = function() {
        return Math.sqrt((this.speed.x * this.speed.x) + (this.speed.y * this.speed.y));
    };

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.sprite.height = dimensions.y;
    this.sprite.width = dimensions.x;

    this.lateral = Math.sqrt((this.sprite.height / 2 * this.sprite.height / 2) + (this.sprite.width / 2 * this.sprite.width / 2));
    
    this.corners = [];
    this.normals = [];

    this.getCorners = function() {
        this.corners = [];
        
        //Top right corner
        var cornerX = this.sprite.position.x + (this.lateral * Math.cos(this.sprite.rotation - (Math.PI / 4)));
        var cornerY = this.sprite.position.y + (this.lateral * Math.sin(this.sprite.rotation - (Math.PI / 4)));
        this.corners.push(new Point(cornerX, cornerY));
    
        //Bottom right corner
        cornerX = this.sprite.position.x + (this.lateral * Math.cos(this.sprite.rotation + (Math.PI / 4)));
        cornerY = this.sprite.position.y + (this.lateral * Math.sin(this.sprite.rotation + (Math.PI / 4)));
        this.corners.push(new Point(cornerX, cornerY));
    
        //Bottom left corner
        cornerX = this.sprite.position.x - (this.lateral * Math.cos(this.sprite.rotation - (Math.PI / 4)));
        cornerY = this.sprite.position.y - (this.lateral * Math.sin(this.sprite.rotation - (Math.PI / 4)));
        this.corners.push(new Point(cornerX, cornerY));
    
        //Top left corner
        cornerX = this.sprite.position.x - (this.lateral * Math.cos(this.sprite.rotation + (Math.PI / 4)));
        cornerY = this.sprite.position.y - (this.lateral * Math.sin(this.sprite.rotation + (Math.PI / 4)));
        this.corners.push(new Point(cornerX, cornerY));
    };
    
    this.getNormals = function() {
        this.normals = [];
        
        for (var i = 0; i < this.corners.length; i++) {
            var j = i + 1;
            if (j === this.corners.length) {
                j = 0;
            }
            
            this.normals.push(this.corners[i].subPoint(this.corners[j]).calcNormal());
        }
    };

    this.detectCollision = detectCollision.bind(this);
    this.detectCollisionAxis = detectCollisionAxis.bind(this);
    
    Stage.addChild(this.sprite);
};

Projectile.prototype.remove = function() {
    Stage.removeChild(this.sprite);
}

Projectile.prototype.setPosition = function(position) {
    this.relativePos.x = position.x;
    this.relativePos.y = position.y;

    this._absolutePos.x = position.x;
    this._absolutePos.y = position.y;
    calcAbsolute(this._absolutePos);

    this.sprite.position.x = this._absolutePos.x;
    this.sprite.position.y = this._absolutePos.y;
};

Projectile.prototype.setSpeed = function(speed) {
    this.speed.x = speed.x;
    this.speed.y = speed.y;
};

Projectile.prototype.setTint = function(tint) {
    this.sprite.texture.tint = tint;
};

Projectile.prototype.getTint = function(tint) {
    return this.sprite.texture.tint;
};

Projectile.prototype.step = function() {
    if (this.totalDistance < Constants.PROJECTILE_DISTANCE) {
        this.relativePos.x += this.speed.x;
        this.relativePos.y += this.speed.y;

        /* Wrap projectile position to the edges of the map */
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

        this.totalDistance += this.calcDistance();

        this.setPosition(this.relativePos);
    } else {
        Stage.removeProjectile(this);
    }
};

Projectile.prototype.equals = function(projectile2) {
    if (!this.relativePos.equals(projectile2.relativePos)) {
        return false;
    }
    if (!this._absolutePos.equals(projectile2._absolutePos)) {
        return false;
    }
    if (!this.speed.equals(projectile2.speed)) {
        return false;
    }
    if (this.totalDistance !== projectile2.totalDistance) {
        return false;
    }

    return true;
};

module.exports = Projectile;
