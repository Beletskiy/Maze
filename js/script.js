function Maze () {

    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.hasAttrBorderArr = [];
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
    this.numberOfCurrentIteration = 1;
    this.currentPositionArr = [];
    this.findWayOutOffset = 0;
}

Maze.prototype.types = {
    OUTSIDE : 2,
    INSIDE : 0,
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
    while (this.hasAttrBorderArr.length > 0) {

        numberOfHasAttrBorderLocations = this.hasAttrBorderArr.length;
        randLocation = this.chooseRandLocation(numberOfHasAttrBorderLocations);
        currentX = this.hasAttrBorderArr[randLocation].x;
        currentY = this.hasAttrBorderArr[randLocation].y;
        this.modelArr[currentX][currentY][2] = this.types.INSIDE;
        this.deleteElemFromHasAttrBorderArr(currentX, currentY);
        this.changeAttributeFromOutsideToBorder(currentX,currentY);

        hasInsideArr = this.hasAttrInside(currentX, currentY);
        numberOfHasAttrInsideLocations = hasInsideArr.length;
        randLocation = this.chooseRandLocation(numberOfHasAttrInsideLocations);
        x = hasInsideArr[randLocation].x;
        y = hasInsideArr[randLocation].y;
        this.breakWall(currentX, currentY, x, y);
    }
};

Maze.prototype.deleteElemFromHasAttrBorderArr= function (currentX, currentY) {
    var hasAttrBorderArrLength = this.hasAttrBorderArr.length;
    for (var i = 0; i < hasAttrBorderArrLength; i++) {
        if (this.hasAttrBorderArr[i].x == currentX && this.hasAttrBorderArr[i].y == currentY ) {
            this.hasAttrBorderArr.splice(i, 1);
            return false;
        }
    }
};

Maze.prototype.chooseRandLocation = function (numberOfLocations) {
    return Math.floor(Math.random()*numberOfLocations);
};

Maze.prototype.hasAttrInside = function (currentX, currentY) { //find all neighbors , what have attribute inside

    var hasAttrInsideArr = [],
        isCellTypeInside,
        offsetX, offsetY,
        yInBorders, xInBorders,
        obj;

    for (var i = 0; i < this.neighborsLength; i++) {
        obj = this.neighbors[i];
        offsetY = currentY + obj.y;
        offsetX = currentX + obj.x;
        yInBorders = (offsetY < this.height) && (offsetY > -1);
        xInBorders = (offsetX < this.width) && (offsetX > -1);
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
    var offsetX, offsetY,
        yInBorders, xInBorders,
        isOffsetCellOutsideType,
        obj;
    for (var i = 0; i < this.neighborsLength; i++) {
         obj = this.neighbors[i];
            offsetX = x + obj.x;
            offsetY = y + obj.y;
            yInBorders = (offsetY < this.height) && (offsetY > -1);
            xInBorders = (offsetX < this.width) && (offsetX > -1);

        if (xInBorders && yInBorders) {
            isOffsetCellOutsideType = (this.modelArr[offsetX][offsetY][2] == this.types.OUTSIDE);
            if (isOffsetCellOutsideType) {
                this.modelArr[offsetX][offsetY][2] = this.types.BORDER;
                this.hasAttrBorderArr.push(({x: offsetX, y: offsetY}));
            }
        }
    }
};
/* -------------------------------------Solving Maze ------------------------------------------------*/
Maze.prototype.startSolvingMaze = function (startX, startY, finishX, finishY) {
    this.modelArr[startX][startY][2] = this.numberOfCurrentIteration;
    this.currentPositionArr.push({x : startX, y : startY});
    this.findWayOut(this.currentPositionArr, finishX, finishY);
};

Maze.prototype.findWayOut = function (currentPositionArr, finishX, finishY) {
    var currentPositionArrLength = currentPositionArr.length,
        x, y,
        obj,
        offsetX,
        offsetY,
        yInBorders,
        xInBorders,
        isOffsetCellInsideType,
        finishLocation = {x: finishX, y: finishY};

    for (var j = this.findWayOutOffset; j < currentPositionArrLength; j++) {
        x = currentPositionArr[j].x;
        y = currentPositionArr[j].y;

        for (var i = 0; i < this.neighborsLength; i++) {
            obj = this.neighbors[i];
            offsetX = x + obj.x;
            offsetY = y + obj.y;
            yInBorders = (offsetY < this.height) && (offsetY > -1);
            xInBorders = (offsetX < this.width) && (offsetX > -1);

            if (xInBorders && yInBorders) {
                isOffsetCellInsideType = (this.modelArr[offsetX][offsetY][2] == this.types.INSIDE);

                if ((isOffsetCellInsideType) && (!this.isWallBetweenLocations(x, y, offsetX, offsetY))) {
                    this.modelArr[offsetX][offsetY][2] = this.numberOfCurrentIteration + 1;

                    if ((offsetX == finishLocation.x) && (offsetY == finishLocation.y)) {
                        console.log("Find a way!");
                        this.calculateWayOutArr(finishLocation);
                        return false;
                    }
                    currentPositionArr.push({x: offsetX, y: offsetY});
                }
            }
        }
        this.findWayOutOffset++;
    }
    this.numberOfCurrentIteration++;
    this.findWayOut(currentPositionArr, finishX, finishY);
};
Maze.prototype.isWallBetweenLocations = function (x, y, offsetX, offsetY) {
    var firstLocationLeftWall = this.modelArr[x][y][0],
        secondLocationLeftWall = this.modelArr[offsetX][offsetY][0],
        firstLocationTopWall = this.modelArr[x][y][1],
        secondLocationTopWall = this.modelArr[offsetX][offsetY][1];

    if (offsetX !== x) {
        return (offsetX > x) && (secondLocationLeftWall == 1) || (offsetX < x) && (firstLocationLeftWall == 1);
    }
    if (offsetY !== y) {
        return (offsetY > y) && (secondLocationTopWall == 1) || (offsetY < y) && (firstLocationTopWall == 1);
    }
};
Maze.prototype.calculateWayOutArr = function (finishLocation) {
    var wayOutArr = [],
        currentX = finishLocation.x,
        currentY = finishLocation.y,
        lastNumber = this.modelArr[currentX][currentY][2],
        obj,
        offsetX,
        offsetY,
        yInBorders,
        xInBorders,
        isRightPenultNumber,
        currentLastNumber = lastNumber;
    wayOutArr.push({x: currentX, y: currentY});

    while (wayOutArr.length < lastNumber) {
        for (var i = 0; i < this.neighborsLength; i++) {
            obj = this.neighbors[i];
            offsetX = currentX + obj.x;
            offsetY = currentY + obj.y;
            yInBorders = (offsetY < this.height) && (offsetY > -1);
            xInBorders = (offsetX < this.width) && (offsetX > -1);

            if (xInBorders && yInBorders ) {
                isRightPenultNumber = (this.modelArr[offsetX][offsetY][2] == currentLastNumber - 1);
                if (!this.isWallBetweenLocations(currentX, currentY, offsetX, offsetY) && isRightPenultNumber) {
                    wayOutArr.push({x: offsetX, y: offsetY});
                    currentLastNumber--;
                    currentX = offsetX;
                    currentY = offsetY;
                }
            }
        }
    }
    this.drawer.drawWayOut(wayOutArr);
};

var maze = new Maze();
//maze.createRandomModel(5, 5);

console.time('test');
maze.createPrimaModel(10, 10);
console.timeEnd('test');
maze.drawer.drawField(maze.modelArr);
console.time('findWayOut');
maze.startSolvingMaze(0, 0, 9, 9);
console.timeEnd('findWayOut');
