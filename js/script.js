function Maze () {

    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.width = 0;
    this.height = 0;
    this.neighbors = [
        {
            x : 0,
            y : -1
        },
        {
            x : 0,
            y : 1
        },
        {
            x : 1,
            y : 0
        },
        {
            x : -1,
            y : 0
        }
    ];
}

Maze.prototype.createRandomModel = function(w,h) {
    var leftBorder,
        topBorder;
    this.modelArr = [];
    this.width = w;
    this.height = h;
    for (var i = 0; i < this.width; i++) {
        var t = [];
        for (var j = 0; j < this.height; j++){
            leftBorder = Math.round(Math.random());
            topBorder = Math.round(Math.random());
            t.push([leftBorder, topBorder]);
        }
        this.modelArr.push(t);
    }
};

Maze.prototype.createPrimaModel = function (w, h) {
    /* -----------------------initialize------------------ */
    var leftWall = 1,
        topWall = 1,
        cellAttribute = 2; // outside attribute
    this.modelArr = [];
    this.width = w;
    this.height = h;

    for (var i = 0; i < this.width; i++) {
        var t = [];
        for (var j = 0; j < this.height; j++){
            t.push([leftWall, topWall, cellAttribute]);
        }
        this.modelArr.push(t);
    }
    var x = Math.floor(Math.random()*this.width),
        y = Math.floor(Math.random()*this.height);

    this.modelArr[x][y][2] = 3; //inside attribute
    this.changeAttributeFromOutsideToBorder(x,y);
    console.log(x, ' ', y);
/* ----------------------- end initialize ----------------- */
    var hasBorder = this.hasAttrBorder(this.modelArr);
    while (hasBorder.length > 0) {
        var numberOfHasAttrBorderLocation = hasBorder.length;
        var randLocation = Math.floor(Math.random()*numberOfHasAttrBorderLocation);
        var currentX = hasBorder[randLocation].x;
        var currentY = hasBorder[randLocation].y;
        this.modelArr[currentX][currentY][2] = 3; // inside attribute
        this.changeAttributeFromOutsideToBorder(currentX,currentY);

        var hasInside = this.hasAttrInside(this.modelArr, currentX, currentY);
        var numberOfHasAttrInsideLocation = hasInside.length;
        randLocation = Math.floor(Math.random()*numberOfHasAttrInsideLocation);
        x = hasInside[randLocation].x;
        y = hasInside[randLocation].y;

        this.breakWall(currentX, currentY, x, y );
        hasBorder = this.hasAttrBorder(this.modelArr);
    }
};

Maze.prototype.hasAttrInside = function (modelArr, currentX, currentY) { //find all neighbors , what have attribute inside(3)
    var hasAttrInsideArr = [];

    for (var i = 0; i < this.neighbors.length; i++) {
        var obj = this.neighbors[i];
        if ( (currentY + obj.y) < this.height && (currentX + obj.x) < this.width && (currentY + obj.y > -1)
            && (currentX + obj.x > -1)
            && (this.modelArr[currentX + obj.x][currentY + obj.y][2] == 3)) {
            hasAttrInsideArr.push({x:currentX + obj.x, y:currentY + obj.y});
        }
    }
    return hasAttrInsideArr;
};

Maze.prototype.hasAttrBorder = function (modelArr){
    var hasAttrBorderArr = [];
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                if (modelArr[j][i][2] == 4) {
                    hasAttrBorderArr.push({x:j,y:i});
                }
            }
        }
    return hasAttrBorderArr;
};

Maze.prototype.breakWall = function (currentX, currentY, x, y) { //  оптимизировать
    // разбить левую стену у того location ,  где х больше
    // разбить верхнюю стену у того location , где y больше
    if (currentX > x) {
        this.modelArr[currentX][currentY][0] = 0;
        return false;
    } else if (x > currentX) {
        this.modelArr[x][y][0] = 0;
        return false;
    } else if (currentY > y) {
        this.modelArr[currentX][currentY][1] = 0;
        return false;
    } else if (y > currentY) {
        this.modelArr[x][y][1] = 0;
        return false;
    }
};

Maze.prototype.changeAttributeFromOutsideToBorder = function (x,y) {

    for (var i = 0; i < this.neighbors.length; i++) {
        var obj = this.neighbors[i];
        if ( (y + obj.y) < this.height && (x + obj.x) < this.width && (y + obj.y > -1) && (x + obj.x > -1)
            && (this.modelArr[x + obj.x][y + obj.y][2] == 2)) {
            this.modelArr[x + obj.x][y + obj.y][2] = 4; // border attribute
        }
    }
};

var maze = new Maze();
//maze.createRandomModel(5, 5);
maze.createPrimaModel(10, 10);
maze.drawer.drawField(maze.modelArr);
//console.log(maze);