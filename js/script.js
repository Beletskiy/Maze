function Maze () {

    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.width = 0;
    this.height = 0;
}

Maze.prototype.createModel = function(w,h) {
    this.modelArr = [];
    this.width = w;
    this.height = h;
    for (var i=0; i<this.width; i++) {
        var t = [];
        for (var j=0; j<this.height; j++){
            t.push([Math.round(Math.random()), Math.round(Math.random())]);
        }
        this.modelArr.push(t);
    }
};

var maze = new Maze();
maze.createModel(5, 5);
maze.drawer.drawField(maze.modelArr);
console.log(maze);