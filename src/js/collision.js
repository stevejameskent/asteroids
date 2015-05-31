var detectCollision = function(box2) {
    this.getCorners();
    box2.getCorners();
    
    this.getNormals();
    box2.getNormals();
    
    for (var i = 0; i < this.normals.length; i++) {
        if (!(this.detectCollisionAxis(this.normals[i], box2))) {
            return false;
        }
    }
    
    for (var j = 0; j < box2.normals.length; j++) {
        if (!(this.detectCollisionAxis(box2.normals[j], box2))) {
            return false;
        }
    }
    
    return true;
};

var detectCollisionAxis = function(axis, box2) {
    var maxProjBox1 = this.corners[0].calcDot(axis);
    var minProjBox1 = this.corners[0].calcDot(axis);
    var maxProjBox2 = box2.corners[0].calcDot(axis);
    var minProjBox2 = box2.corners[0].calcDot(axis);

    for (var i = 1; i < this.corners.length; i++) {
        var newProj = this.corners[i].calcDot(axis);
        if (newProj > maxProjBox1) {
            maxProjBox1 = newProj;
        }
        if (newProj < minProjBox1) {
            minProjBox1 = newProj;
        }
    }
    for (var j = 1; j < box2.corners.length; j++) {
        var newProj = box2.corners[j].calcDot(axis);
        if (newProj > maxProjBox2) {
            maxProjBox2 = newProj;
        }
        if (newProj < minProjBox2) {
            minProjBox2 = newProj;
        }
    }
        
    return (maxProjBox2 < minProjBox1 || maxProjBox1 > minProjBox2);
};

module.exports = {
    detectCollision: detectCollision,
    detectCollisionAxis: detectCollisionAxis
};
