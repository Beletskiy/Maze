
function CanvasDrawer () {
    this.cellSize = 20;
    this.canvasField = document.getElementById("canvasGameField");
    this.ctx = this.canvasField.getContext('2d');
}
CanvasDrawer.prototype.drawField = function (modelArr) {
    var canvasArr = modelArr,
        cellSize = this.cellSize,
        ctx = this.ctx,
        width = canvasArr.length,
        height = canvasArr[0].length,
        offset = 0.5;

    this.canvasField.width = this.cellSize*width + offset*2;
    this.canvasField.height = this.cellSize*height + offset*2;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(offset, offset, width*cellSize , height*cellSize );
    ctx.beginPath();
    for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
            if (canvasArr[i][j][0] == 1) {  //draw leftWall
                ctx.moveTo(i*cellSize + offset, j*cellSize + offset);
                ctx.lineTo(i*cellSize + offset, j*cellSize + cellSize + offset);
            }
            if (canvasArr[i][j][1] == 1) {  // draw topWall
                ctx.moveTo(i*cellSize + offset, j*cellSize + offset);
                ctx.lineTo(i*cellSize + cellSize + offset, j*cellSize + offset);
            }
        }
    }
    ctx.stroke();
};
CanvasDrawer.prototype.drawWayOut = function (wayOutArr) {
    var wayOutArrLength = wayOutArr.length,
        cellSize = this.cellSize,
        ctx = this.ctx;
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    for (var i = 0; i < wayOutArrLength - 1; i++) {
        ctx.moveTo(wayOutArr[i].x*cellSize + cellSize/2, wayOutArr[i].y*cellSize + cellSize/2);
        ctx.lineTo(wayOutArr[i + 1].x*cellSize + cellSize/2, wayOutArr[i + 1].y*cellSize + cellSize/2);
    }
    ctx.stroke();
};

