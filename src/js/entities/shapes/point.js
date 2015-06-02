var Point = function(x, y) {
    this.x = x;
    this.y = y;
};

Point.prototype.calcDot = function(point2) {
    return ((this.x * point2.x) + (this.y * point2.y));
};

Point.prototype.calcNormal = function() {
    return new Point(-1 * this.y, this.x);
};

Point.prototype.subPoint = function(point2) {
    return new Point(point2.x - this.x, point2.y - this.y);  
};

Point.prototype.equals = function(point2) {
    if (this.x === point2.x && this.y === point2.y) {
        return true;
    } else {
        return false;
    }
};

module.exports = Point;
