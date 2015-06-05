'use strict';

var Point = require('./point');

var Triangle = function(sprite, anchorX, anchorY, x, y, height, width) {
    this.sprite = sprite;
    this.sprite.anchor.x = anchorX;
    this.sprite.anchor.y = anchorY;
    
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    
    this.sprite.height = height;
    this.sprite.width = width;

    this.dimensions = {
        height: this.sprite.height,
        width: this.sprite.width
    };
    
    this.corners = [new Point(0, 0), new Point(0, 0), new Point(0, 0)];
    this.normals = [];
    
    this.c = Math.sqrt((.4 * this.sprite.height * .4 * this.sprite.height) + (.5 * this.sprite.width * .5 * this.sprite.width));
    
    this.phi = Math.acos((.4 * this.sprite.height) / this.c);
    
    this.getCorners = function() {
        var position = this.getPosition();
        var dimensions = this.getDimensions();

        //Top corner
        this.totalAngle = (Math.PI / 2) - this.sprite.rotation;
        this.corners[0].x = position.x + (0.6 * dimensions.height * Math.cos(this.totalAngle));
        this.corners[0].y = position.y - (0.6 * dimensions.height * Math.sin(this.totalAngle));
        
        //Bottom right corner
        this.totalAngle = ((3 * Math.PI) / 2) - this.sprite.rotation + this.phi;
        this.corners[1].x = position.x + (this.c * Math.cos(this.totalAngle));
        this.corners[1].y = position.y - (this.c * Math.sin(this.totalAngle));
        
        //Bottom left corner
        this.totalAngle = ((3 * Math.PI) / 2) - this.sprite.rotation - this.phi;
        this.corners[2].x = position.x + (this.c * Math.cos(this.totalAngle));
        this.corners[2].y = position.y - (this.c * Math.sin(this.totalAngle));
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
};

Triangle.prototype.getPosition = function() {
    return this.sprite.position;
};

Triangle.prototype.getDimensions = function() {
    return this.dimensions;
};

module.exports = Triangle;
