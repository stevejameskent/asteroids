var Triangle = function(texture, anchorX, anchorY, x, y, height, width) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.x = anchorX;
    this.sprite.anchor.y = anchorY;
    
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    
    this.sprite.height = height;
    this.sprite.width = width;
    
    this.corners = [];
    this.normals = [];
    
    this.c = Math.sqrt((.4*this.sprite.height * .4*this.sprite.height) + (.5*this.sprite.width * .5*this.sprite.width));
    
    this.phi = Math.acos((.4 * this.sprite.height) / this.c);
    
    this.getCorners = function() {
        //Top corner
        this.totalAngle = (Math.PI / 2) - this.sprite.rotation;
        var cornerX = this.sprite.position.x + (0.6 * this.sprite.height * Math.cos(this.totalAngle));
        var cornerY = this.sprite.position.y - (0.6 * this.sprite.height * Math.sin(this.totalAngle));
        this.corners[0] = new Point(cornerX, cornerY);
        
        //Bottom right corner
        this.totalAngle = ((3 * Math.PI) / 2) - this.sprite.rotation + this.phi;
        cornerX = this.sprite.position.x + (this.c * Math.cos(this.totalAngle));
        cornerY = this.sprite.position.y - (this.c * Math.sin(this.totalAngle));
        this.corners[1] = new Point(cornerX, cornerY);
        
        //Bottom left corner
        this.totalAngle = ((3 * Math.PI) / 2) - this.sprite.rotation - this.phi;
        cornerX = this.sprite.position.x + (this.c * Math.cos(this.totalAngle));
        cornerY = this.sprite.position.y - (this.c * Math.sin(this.totalAngle));
        this.corners[2] = new Point(cornerX, cornerY);
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

    stage.addChild(this.sprite);
};