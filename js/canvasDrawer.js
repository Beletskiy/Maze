
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

    ctx.strokeStyle = 'black';
    ctx.strokeRect(offset, offset, width*cellSize, height*cellSize );

        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
            if (canvasArr[i][j][0] == 1) {
                ctx.moveTo(i*cellSize + offset, j*cellSize + offset);
                ctx.lineTo(i*cellSize + offset, j*cellSize + cellSize + offset);
                //ctx.stroke();
            }
            if (canvasArr[i][j][1] == 1) {
                ctx.moveTo(i*cellSize + offset, j*cellSize + offset);
                ctx.lineTo(i*cellSize + cellSize + offset, j*cellSize + offset);
                //ctx.stroke();
            }
        }
    }
    ctx.stroke();

};

