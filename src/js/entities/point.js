var Point = function(x, y) {
    this.x = x;
    this.y = y;
    
    this.calcDot = function(point2) {
        return ((this.x * point2.x) + (this.y * point2.y));  
    };
    
    this.calcNormal = function() {
        return new Point(-1 * this.y, this.x);
    };
    
    this.subPoint = function(point2) {
        return new Point(point2.x - this.x, point2.y - this.y);  
    };
};

module.exports = Point;
