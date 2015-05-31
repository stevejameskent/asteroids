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
    // console.log(this.pixelRatio);
    // this.pixelRatio = 2;

    calcStageDimensions.bind(this)();

    var gameStage = new PIXI.Stage(0x212226);
    var gameRenderer = PIXI.autoDetectRenderer(this.width, this.height, {antialias: false, resolution: this.pixelRatio});

    this.draw = function() {
        gameRenderer.render(gameStage);
    };

    this.addEntity = function(entity) {
        gameStage.addChild(entity);
    };

    this.removeEntity = function(entity) {
        gameStage.removeChild(entity);
    };

    gameRenderer.view.id = "game"
    if (this.scaleCanvasDown) {
        gameRenderer.view.style.width = this.width / this.pixelRatio;
        gameRenderer.view.style.height = this.height / this.pixelRatio;
    } else {
        gameRenderer.view.style.width = this.width;
        gameRenderer.view.style.height = this.height;
    }
    document.body.appendChild(gameRenderer.view);
    console.log(gameRenderer.view.attributes)
};

module.exports = new Stage();
