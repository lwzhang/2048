var Game = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.radius = this.width / 8;

    this.numNodes = [];
    this.position = {x: [], y: []};
};

var p = Game.prototype;

p.init = function () {
    this.createGrid();
    this.createCircle();
    this.go();
};

p.createGrid = function () {
    var canvas = this.canvas;
    var ctx = this.ctx;
    var radius = this.radius;
    var x, y;
    for (var i = 0; i < 4; i++) {
        x = (i * 2 + 1) * radius;
        for (var j = 0; j < 4; j++) {
            y = (j * 2 + 1) * radius;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
    }
};

p.createCircle = function () {
    var ctx = this.ctx;
    for (var i = 0; i < 2; i++) {
        var flag = true;
        while (flag) {
            var x = parseInt(4 * Math.random());
            var y = parseInt(4 * Math.random());
            if (this.compare(x, y)) {
                flag = false;
            }
        }
        var num = 2;
        this.numNodes.push({x: x, y: y, num: num});
        this.position.x.push(x);
        this.position.y.push(y);
        this.createBg(x, y);
        this.createNum(x, y, num);
    }
};

p.createBg = function (x, y) {
    var ctx = this.ctx;
    x = (x * 2 + 1) * this.radius;
    y = (y * 2 + 1) * this.radius;
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, y, this.radius - 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
};

p.createNum = function (x, y, num) {
    var ctx = this.ctx;
    x = (x * 2 + 1) * this.radius;
    y = (y * 2 + 1) * this.radius;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "20px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), x, y);
    ctx.closePath();
};

p.compare = function (x, y) {
    for (var i = 0; i < this.numNodes.length; i += 1) {
        if (this.numNodes[i].x === x && this.numNodes[i].y === y) {
            return false;
        }
    }
    return true;
};

p.go = function () {
    var that = this;
    document.onkeypress = function (e) {
        e = e || window.event;
        var code = e.keyCode || e.charCode;
        switch (code) {
            case 37:
                break;
            case 38:
                break;
            case 39:
                break;
            case 40:

                break;
        }
    }
};

p.getFarthestPos = function (x) {
    for (var i = 0; i < 4; i++) {
        for (var j = 3; j >= 0; j--) {
            if (i == x) {
                if (this.getNum(i, j)) {
                    return this.getNum(i, j).y;
                }
            }
        }
    }
}

p.plusSameNum = function () {
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var num = this.getNum(x, y);
            for (var z = y + 1; z < 4; z++) {
                var num1 = this.getNum(x, z);
                if (num && num1 && num.num === num1.num) {

                }
            }
        }
    }
};

p.getNum = function (x, y) {
    for (var i = 0; i < this.numNodes.length; i++) {
        var posX = this.numNodes[i].x;
        var posY = this.numNodes[i].y;
        if (posX === x && posY === y) {
            return this.numNodes[i];
        }
    }
    return false;
}

var game = new Game(document.querySelector("canvas"));
game.init();