'use strict';

var Point = require('./point');

var Rectangle = function(sprite, anchorX, anchorY, x, y, height, width) {
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
    
    this.lateral = Math.sqrt((this.sprite.height / 2 * this.sprite.height / 2) + (this.sprite.width / 2 * this.sprite.width / 2));
    
    this.corners = [new Point(0, 0), new Point(0, 0), new Point(0, 0), new Point(0, 0)];
    this.normals = [];
    
    this.getCorners = function() {
        var position = this.getPosition();
        
        //Top right corner
        this.corners[0].x = position.x + (this.lateral * Math.cos(this.sprite.rotation - (Math.PI / 4)));
        this.corners[0].y = position.y + (this.lateral * Math.sin(this.sprite.rotation - (Math.PI / 4)));
    
        //Bottom right corner
        this.corners[1].x = position.x + (this.lateral * Math.cos(this.sprite.rotation + (Math.PI / 4)));
        this.corners[1].y = position.y + (this.lateral * Math.sin(this.sprite.rotation + (Math.PI / 4)));
    
        //Bottom left corner
        this.corners[2].x = position.x - (this.lateral * Math.cos(this.sprite.rotation - (Math.PI / 4)));
        this.corners[2].y = position.y - (this.lateral * Math.sin(this.sprite.rotation - (Math.PI / 4)));
    
        //Top left corner
        this.corners[3].x = position.x - (this.lateral * Math.cos(this.sprite.rotation + (Math.PI / 4)));
        this.corners[3].y = position.y - (this.lateral * Math.sin(this.sprite.rotation + (Math.PI / 4)));
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

Rectangle.prototype.getPosition = function() {
    return this.sprite.position;
};

Rectangle.prototype.getDimensions = function() {
    return this.dimensions;
};

module.exports = Rectangle;
