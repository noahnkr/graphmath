import MathExpression from "./expression.js";

class Grapher {

    constructor() {
        this.canvas = document.getElementById('graph');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 10000;
        this.canvas.height = 10000;
        this.gridSize = 100;
        this.gridColor = '#fff';
        this.backgroundColor = '#343434';

        this.xRange = {
            min: -((this.canvas.width / 2) / this.gridSize),
            max: ((this.canvas.width / 2) / this.gridSize)
        };


        this.yRange = {
            min: -((this.canvas.height / 2) / this.gridSize),
            max: ((this.canvas.height / 2) / this.gridSize)
        };

        this.xScale = this.canvas.width / (this.xRange.max - this.xRange.min);
        this.yScale = this.canvas.height / (this.yRange.max - this.yRange.min);

        this.posX = -(this.canvas.width / 2.5);
        this.posY = -(this.canvas.height / 2.3);
        this.lastX = 0;
        this.lastY = 0;
        this.scale = 0.5;
        this.isDragging - false;

        this.increment = 0.02;
        this.functions = [];

        this.canvas.addEventListener('mousedown', () => {
            this.isDragging = true;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mousemove', event => {
            if (this.isDragging) {
                var deltaX = event.clientX - this.lastX;
                var deltaY = event.clientY - this.lastY;
                this.posX += deltaX;
                this.posY += deltaY;
                this.render();
            }

            this.lastX = event.clientX;
                this.lastY = event.clientY;
        });

        this.canvas.addEventListener('mouseleave', event => {
            this.isDragging = false
        });

        this.canvas.addEventListener('wheel', event => {
            var zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            this.scale *= zoomFactor;
            if (this.scale < 0.1) {
                this.scale = 0.1;
            }

            this.render();
            event.preventDefault();
        });

        this.render();
    }

    render() {
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.posX, this.posY);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawLabels();
        this.drawFunctions();
        this.ctx.restore();
    }

    drawGrid() {
        this.ctx.strokeStyle = this.gridColor;

        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.5;

        // draw x axes
        for (var i = 0; i < this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        // draw y axes
        for (var i = 0; i < this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 1;

        // draw x origin
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.closePath();

        // draw y origin
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawLabels() {
        this.ctx.fillStyle = '#fff';
        this.ctx.globalAlpha = 0.5;
        this.ctx.font = '24px Roboto';

        // x labels
        for (var i = 0; i <= this.canvas.width; i += this.gridSize) {
            var value = (i - (this.canvas.width / 2)) / this.gridSize;
            this.ctx.fillText(value, i + (this.gridSize / 16) , this.canvas.height / 2 - (this.gridSize / 8));
        }

        // y labels
        for (var i = this.canvas.height; i >= 0; i -= this.gridSize) {
            var value = -(i - (this.canvas.height / 2)) / this.gridSize;
            // origin label already drawn
            if (value != 0) {
                this.ctx.fillText(value, this.canvas.width / 2 + (this.gridSize / 16), i - (this.gridSize / 8))
            }
        }
    }


    drawFunctions() {
        for (var i in this.functions) {
            this.drawFunction(i);
        }
    }

    drawFunction(index) {
        var f = this.functions[index].func;
        this.ctx.strokeStyle = this.functions[index].color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(0, (f(this.xRange.min) - this.yRange.min) * this.yScale);

        for (var x = this.xRange.min; x <= this.xRange.max; x += this.increment) {
            var y = f(x);
            this.ctx.lineTo((x - this.xRange.min) * this.xScale, this.canvas.height - ((y - this.yRange.min) * this.yScale));
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }

    addFunction(f, color) {
        this.functions.push({
            func: f,
            color: color
        });

        this.render();
    }
}

var g = new Grapher();

g.addFunction(MathExpression.makeFunction('x^2'), 'red');



