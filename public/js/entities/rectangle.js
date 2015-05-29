var pixelationFilter = new PIXI.PixelateFilter();
pixelationFilter.size = {x: 1, y: 1};

var Rectangle = function(texture, anchorX, anchorY, x, y, height, width) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.filters = [pixelationFilter];
    this.sprite.filters[0].size = {x: 1, y: 1};
    this.sprite.anchor.x = anchorX;
    this.sprite.anchor.y = anchorY;
    
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    
    this.sprite.height = height;
    this.sprite.width = width;
    
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
    
    stage.addChild(this.sprite);
};