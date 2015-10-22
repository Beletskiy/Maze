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
    this.numberOfIteration = 1;
    this.currentPositionArr = [];
}

Maze.prototype.types = {
    OUTSIDE : 2,
    INSIDE : 0,
    BORDER : 4,
    START_LOCATION : {x:0, y:0}
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
                this.modelArr[offsetX][offsetY][2] = this.types.BORDER;
            }
        }
    }
};
Maze.prototype.startSolvingMaze = function () {
    this.modelArr[this.types.START_LOCATION.x][this.types.START_LOCATION.y][2] = this.numberOfIteration;
    var x = this.types.START_LOCATION.x,
        y = this.types.START_LOCATION.y;
    this.currentPositionArr.push({x : x, y : y});
    this.findWay(this.currentPositionArr);
};

Maze.prototype.findWay = function (currentPositionArr) {

    var currentPositionArrLength = currentPositionArr.length,
        finishLocation = {x: this.width -1, y: this.height - 1};

    for (var j = 0; j < currentPositionArrLength; j++) {
        var x = currentPositionArr[j].x,
            y = currentPositionArr[j].y;
        for (var i = 0; i < this.neighborsLength; i++) {
            var obj = this.neighbors[i],
                offsetX = x + obj.x,
                offsetY = y + obj.y,
                yInBorders = (offsetY < this.height) && (offsetY > -1),
                xInBorders = (offsetX < this.width) && (offsetX > -1),
                isOffsetCellInsideType;
            if (xInBorders && yInBorders) {
                isOffsetCellInsideType = (this.modelArr[offsetX][offsetY][2] == this.types.INSIDE);
                if ((isOffsetCellInsideType) && (!this.isWallBetweenLocations(x, y, offsetX, offsetY))) {
                    this.modelArr[offsetX][offsetY][2] = this.numberOfIteration + 1;
                    if ((offsetX == finishLocation.x) && (offsetY == finishLocation.y)) {
                        console.log("Find a way!");
                        //console.log(this.modelArr);
                        this.calculateWayOut(this.modelArr, finishLocation);
                        return false;
                    }
                    currentPositionArr.push({x: offsetX, y: offsetY});
                }
            }
        }
    }
    this.numberOfIteration++;
    this.findWay(currentPositionArr);
};
Maze.prototype.isWallBetweenLocations = function (x, y, offsetX, offsetY) {
    if (offsetX !== x) {
        if ((offsetX > x) && (this.modelArr[offsetX][offsetY][0] == 1)) {
            return true;
        }   else if ((offsetX < x) && (this.modelArr[x][y][0] == 1)) {
            return true;
        }
        return false;
    }
    if (offsetY !== y) {
        if ((offsetY > y) && (this.modelArr[offsetX][offsetY][1] == 1)) {
            return true;
        }   else if ((offsetY < y) && (this.modelArr[x][y][1] == 1)) {
            return true;
        }
        return false;
    }
};
Maze.prototype.calculateWayOut = function (modelArr, finishLocation) {
    var wayOutArr = [],
        currentX = finishLocation.x,
        currentY = finishLocation.y,
        lastNumber = this.modelArr[currentX][currentY][2],
        currentLastNumber = lastNumber;
    wayOutArr.push({x: currentX, y: currentY});

    while (wayOutArr.length < lastNumber) {
        for (var i = 0; i < this.neighborsLength; i++) {
            var obj = this.neighbors[i],
                offsetX = currentX + obj.x,
                offsetY = currentY + obj.y,
                yInBorders = (offsetY < this.height) && (offsetY > -1),
                xInBorders = (offsetX < this.width) && (offsetX > -1);

            if (xInBorders && yInBorders ) {
                var isRightPenultNumber = (this.modelArr[offsetX][offsetY][2] == currentLastNumber - 1);
                if (!this.isWallBetweenLocations(currentX, currentY, offsetX, offsetY) && isRightPenultNumber) {
                    wayOutArr.push({x: offsetX, y: offsetY});
                    //console.log(wayOutArr);
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
console.time('findWay');
maze.startSolvingMaze();
console.timeEnd('findWay');