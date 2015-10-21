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
    this.neighborsLength = this.neighbors.length;
}

Maze.prototype.types = {
    OUTSIDE : 2,
    INSIDE : 3,
    BORDER : 4
};

Maze.prototype.createRandomModel = function(w,h) {
    var leftWall,
        topWall;
    this.modelArr = [];
    this.width = w;
    this.height = h;
    for (var i = 0; i < this.width; i++) {
        var t = [];
        for (var j = 0; j < this.height; j++){
            leftWall = Math.round(Math.random());
            topWall = Math.round(Math.random());
            t.push([leftWall, topWall]);
        }
        this.modelArr.push(t);
    }
};

Maze.prototype.createPrimaModel = function (w, h) {
    /* -----------------------initialize------------------ */
    var leftWall = 1,
        topWall = 1,
        hasBorderArr,
        numberOfHasAttrBorderLocations,
        hasInsideArr,
        numberOfHasAttrInsideLocations,
        randLocation,
        currentX,
        currentY,
        cellAttribute = this.types.OUTSIDE;
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

    this.modelArr[x][y][2] = this.types.INSIDE;
    this.changeAttributeFromOutsideToBorder(x,y);
/* ----------------------- end initialize ----------------- */
    hasBorderArr = this.hasAttrBorder(this.modelArr);
    while (hasBorderArr.length > 0) {

        numberOfHasAttrBorderLocations = hasBorderArr.length;
        randLocation = this.chooseRandLocation(numberOfHasAttrBorderLocations);
        currentX = hasBorderArr[randLocation].x;
        currentY = hasBorderArr[randLocation].y;
       // currentX = this.calculateRandCoordinates(hasBorderArr, 'x');
       // currentY = this.calculateRandCoordinates(hasBorderArr, 'y');

        this.modelArr[currentX][currentY][2] = this.types.INSIDE; // inside attribute
        this.changeAttributeFromOutsideToBorder(currentX,currentY);
        hasInsideArr = this.hasAttrInside(this.modelArr, currentX, currentY);

        numberOfHasAttrInsideLocations = hasInsideArr.length;
        randLocation = this.chooseRandLocation(numberOfHasAttrInsideLocations);
        x = hasInsideArr[randLocation].x;
        y = hasInsideArr[randLocation].y;
        //   x = this.calculateRandCoordinates(hasInsideArr, 'x');
        //   y = this.calculateRandCoordinates(hasInsideArr, 'y');
        this.breakWall(currentX, currentY, x, y);
        hasBorderArr = this.hasAttrBorder(this.modelArr);
    }
};
/*Maze.prototype.calculateRandCoordinates = function (Arr, axis) {
    var numberOfLocations = Arr.length;
    var randLocation = this.chooseRandLocation(numberOfLocations);
    var randCoordinate = Arr[randLocation][axis];
    return randCoordinate;
}; */
Maze.prototype.chooseRandLocation = function (numberOfLocations) {
    return Math.floor(Math.random()*numberOfLocations);
};
Maze.prototype.hasAttrInside = function (modelArr, currentX, currentY) { //find all neighbors , what have attribute inside(3)

    var hasAttrInsideArr = [];

    for (var i = 0; i < this.neighborsLength; i++) {
        var obj = this.neighbors[i],
            offsetY = currentY + obj.y,
            offsetX = currentX + obj.x,
            yInBorders = (offsetY < this.height) && (offsetY > -1),
            xInBorders = (offsetX < this.width) && (offsetX > -1),
            isCellTypeInside;
        // todo namings & additional variables -----------------------ready-----------------------------------

        if (yInBorders && xInBorders) {
            isCellTypeInside = (this.modelArr[offsetX][offsetY][2] == this.types.INSIDE);
            if (isCellTypeInside) {
                hasAttrInsideArr.push({x : offsetX, y : offsetY});
            }
        }
    }
    return hasAttrInsideArr;
};

Maze.prototype.hasAttrBorder = function (modelArr){

    // todo optimize calls amount

    var hasAttrBorderArr = [];
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
            if (modelArr[j][i][2] == this.types.BORDER) {
                hasAttrBorderArr.push({x:j,y:i});
            }
        }
    }
    return hasAttrBorderArr;
};

Maze.prototype.breakWall = function (currentX, currentY, x, y) {
    // break leftWall, from location, where position x bigger
    // break topWall, from location, where position y bigger
    // todo do not run code in (a ? b : c)

    //var newX = Math.max(x, currentX),
    //    newY = Math.max(y, currentY),
    //    dx = Math.abs(x - currentX),
    //    dy = Math.abs(y - currentY);
    //
    //this.modelArr[newX][newY][0] *= 1 - dx;
    //this.modelArr[newX][newY][1] *= 1 - dy;


    if (currentX !== x) {
        (currentX > x) ? this.modelArr[currentX][currentY][0] = 0 : this.modelArr[x][y][0] = 0;
        return false;
    }
    if (currentY !== y) {
        (currentY > y) ? this.modelArr[currentX][currentY][1] = 0 : this.modelArr[x][y][1] = 0;
        return false;
    }
};

Maze.prototype.changeAttributeFromOutsideToBorder = function (x,y) {

    for (var i = 0; i < this.neighborsLength; i++) {
        var obj = this.neighbors[i],
            offsetX = x + obj.x,
            offsetY = y + obj.y,
            yInBorders = (offsetY < this.height) && (offsetY > -1),
            xInBorders = (offsetX < this.width) && (offsetX > -1),
            isOffsetCellOutsideType;
        if (xInBorders && yInBorders) {
            isOffsetCellOutsideType = (this.modelArr[offsetX][offsetY][2] == this.types.OUTSIDE);
            if (isOffsetCellOutsideType) {
                this.modelArr[offsetX][offsetY][2] = this.types.BORDER; // border attribute
            }
        }
    }
};

var maze = new Maze();
//maze.createRandomModel(5, 5);

console.time('test');
maze.createPrimaModel(10, 10);
console.timeEnd('test');

maze.drawer.drawField(maze.modelArr);