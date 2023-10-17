
    export function Flower(context, centerX, centerY, radius, flowerPetalsData, styleParams = {widthToLengthRatio: 1.0, symmetryFactor: 1.0}){
        this.context = context;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = styleParams.color;

        this.flowerPetalsData = flowerPetalsData;
        this.symmetryFactor = styleParams.symmetryFactor;
        this.numPetals = Object.keys(flowerPetalsData).length;
        this.petalWidth = 2*Math.PI / this.numPetals * radius * styleParams.widthToLengthRatio;
    }

    Flower.prototype.calcWidth = function(length) {
        return 2*Math.PI / this.numPetals * length * this.widthToLengthRatio;
    }

    Flower.prototype.getAffineTransform = function(scale=1.0) {
        return new DOMMatrix([
            scale, 0.0,
            0.0, scale,
            this.centerX, this.centerY,
        ]);
    }
    
    Flower.prototype.petal = function (angle) {
        const [dx,dy] = [Math.cos(angle),Math.sin(angle)];
        const [nx,ny] = [-Math.sin(angle),Math.cos(angle)];

        const s = this.symmetryFactor;
        const length = this.radius;
        const width = this.petalWidth;

        return new Path2D(`M 0 0 
                Q ${dx*length*s+nx*width/2} ${dy*length*s+ny*width/2} ${dx*length} ${dy*length}
                Q ${dx*length*s-nx*width/2} ${dy*length*s-ny*width/2} 0 0 Z`);
    }
  
    Flower.prototype.draw = function(){
        const labels = Object.keys(this.flowerPetalsData);

        for (let n = 0; n < this.numPetals; n++) {
            const angle = 2 * Math.PI * n / this.numPetals;
            const petalData = this.flowerPetalsData[labels[n]];

            let outerPetalPath = new Path2D();
            outerPetalPath.addPath(this.petal(angle), this.getAffineTransform(1.0));

            let innerPetalPath = new Path2D();
            innerPetalPath.addPath(this.petal(angle), this.getAffineTransform(1.0));

            this.context.lineWidth = 1.5;
            this.context.fillStyle = '#cccccc';
            this.context.strokeStyle = '#aaaaaa';
            this.context.fill(outerPetalPath);
            this.context.stroke(outerPetalPath);

            this.context.save();

            this.context.beginPath();
            this.context.translate(this.centerX, this.centerY);
            this.context.rotate(angle);
            this.context.translate(-this.radius*petalData.relValue, -250);
            this.context.rect(0, 0, this.radius*2*petalData.relValue, 500);
            this.context.setTransform(1, 0, 0, 1, 0, 0);

            this.context.clip();
            this.context.fillStyle = petalData.color + 'ff';
            this.context.fill(innerPetalPath);
            this.context.closePath();
            this.context.restore();//push current state into canvas
        }
    }