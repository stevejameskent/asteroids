var Projectile = function(texture) {
    var projectileSpeeds = calcProjectileSpeed(player.sprite.rotation - (0.5 * Math.PI));
    this.speedX = projectileSpeeds.projectileSpeedX;
    this.speedY = projectileSpeeds.projectileSpeedY;

    this.totalDistance = 0;

    this.sprite = new PIXI.Sprite(texture);

    this.calcDistance = function() {
        var distance = Math.sqrt((this.speedX * this.speedX) + (this.speedY * this.speedX));
        return Math.sqrt((this.speedX * this.speedX) + (this.speedY * this.speedY));
    };

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.sprite.position.x = (player.sprite.position.x) + (.6 * player.sprite.height) * Math.sin(player.sprite.rotation);
    this.sprite.position.y = (player.sprite.position.y) - (.6 * player.sprite.height) * Math.cos(player.sprite.rotation);

    this.sprite.height = 5;
    this.sprite.width = 5;

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