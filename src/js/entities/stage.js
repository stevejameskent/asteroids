'use strict';

var calcStageDimensions = function() {
    /* Set stage width and height to largest values at 16:9 ratio that will fit in the window */
    if (this.scaleCanvasDown) {
        this.width = (window.innerWidth / 1.2) * this.pixelRatio;    
    } else {
        this.width = (window.innerWidth / 1.2);
    }
    this.height = this.width * (9 / 16);
};

function Stage() {
    this.scaleCanvasDown = false;
    this.pixelRatio = window.devicePixelRatio;

    if (this.pixelRatio === 4) {
        this.pixelRatio = 2;
        this.scaleCanvasDown = true;
    }

    calcStageDimensions.bind(this)();

    this._playerList = [];
    this._projectileList = [];
    this._asteroidList = [];
    this._gameStage = new PIXI.Container(0x212226);
    this._gameRenderer = PIXI.autoDetectRenderer(this.width, this.height, {antialias: false, resolution: this.pixelRatio});

    if (this.scaleCanvasDown) {
        this._gameRenderer.view.style.width = this.width / this.pixelRatio;
        this._gameRenderer.view.style.height = this.height / this.pixelRatio;
    } else {
        this._gameRenderer.view.style.width = this.width;
        this._gameRenderer.view.style.height = this.height;
    }

    document.body.appendChild(this._gameRenderer.view);
};

Stage.prototype.draw = function() {
    this._gameRenderer.render(this._gameStage);
};

Stage.prototype.addChild = function(entity) {
    this._gameStage.addChild(entity);
};

Stage.prototype.removeChild = function(entity) {
    this._gameStage.removeChild(entity);
};

Stage.prototype.addProjectile = function(projectile) {
    this._projectileList.push(projectile);
};

Stage.prototype.removeProjectile = function(projectile) {
    for (var i = 0; i < this._projectileList.length; i++) {
        if (this._projectileList[i].equals(projectile)) {
            this._projectileList.splice(i, 1);
            projectile.remove();
            break;
        }
    }
};

Stage.prototype.getProjectileList = function() {
    return this._projectileList;
};

Stage.prototype.addPlayer = function(player) {
    this._playerList.push(player);
};

Stage.prototype.removePlayer = function(player) {
    for (var i = 0; i < this._playerList.length; i++) {
        if (this._playerList[i].equals(player)) {
            this._playerList.splice(i, 1);
            player.remove();
            break;
        }
    }
};

Stage.prototype.getPlayerList = function() {
    return this._playerList;
};

Stage.prototype.addAsteroid = function(asteroid) {
    this._asteroidList.push(asteroid);
};

Stage.prototype.removeAsteroid = function(asteroid) {
    for (var i = 0; i < this._asteroidList.length; i++) {
        if (this._asteroidList[i].equals(asteroid)) {
            this._asteroidList.splice(i, 1);
            asteroid.remove();
            break;
        }
    }
};

Stage.prototype.getAsteroidList = function() {
    return this._asteroidList;
};

module.exports = new Stage();
