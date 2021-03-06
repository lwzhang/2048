var Game = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width = window.innerWidth > 500 ? 500 : window.innerWidth * 0.9;
    this.height = canvas.height = window.innerWidth > 500 ? 500 : window.innerWidth * 0.9;
    this.radius = this.width / 8;

    this.numNodes = [];
    this.flag = false;
};

var p = Game.prototype;

p.init = function () {
    this.createGrid();
    this.initNum();
    this.go();
    this.mobileEvent();
};

//画格子
p.createGrid = function () {
    var ctx = this.ctx;
    var radius = this.radius;
    var x, y;
    for (var i = 0; i < 4; i++) {
        x = (i * 2 + 1) * radius;
        for (var j = 0; j < 4; j++) {
            y = (j * 2 + 1) * radius;
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.strokeStyle = "#b8af9e";
            ctx.arc(x, y, radius - 3, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.closePath();
        }
    }
};

// 初始化两个数字
p.initNum = function () {
    for (var i = 0; i < 2; i++) {
        this.drawNum();
    }
};

p.drawNum = function () {
    var obj = this.getAvailablePos();
    var x = obj.x, y = obj.y;
    var num = this.randomNum();
    this.numNodes.push({x: x, y: y, num: num});
    this.createNumBg(x, y, num, 6);
    this.createNum(x, y, num);
};

p.getAvailablePos = function () {
    var flag = true;
    // 循环直到找到可用位置
    while (flag) {
        var x = parseInt(4 * Math.random());
        var y = parseInt(4 * Math.random());
        if (this.compare(x, y)) {
            flag = false;
        }
    }
    return {x: x, y: y};
};

p.randomNum = function () {
    // 2出现的概率大于4
    return Math.random() > 0.9 ? 4 : 2;
};

//数字的背景颜色
p.createNumBg = function (x, y, num, diff) {
    var ctx = this.ctx;
    x = (x * 2 + 1) * this.radius;
    y = (y * 2 + 1) * this.radius;
    ctx.beginPath();
    ctx.fillStyle = this.getBgColor(num);
    ctx.arc(x, y, this.radius - diff, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
};

p.getBgColor = function (num) {
    var bgColor;
    switch (num) {
        case 2:
            bgColor = "#eee4da";
            break;
        case 4:
            bgColor = "#ede0c8";
            break;
        case 8:
            bgColor = "#f2b179";
            break;
        case 16:
            bgColor = "#f59563";
            break;
        case 32:
            bgColor = "#f67c5f";
            break;
        case 64:
            bgColor = "#f65e3b";
            break;
        case 128:
            bgColor = "#edcf72";
            break;
        case 256:
            bgColor = "#edcc61";
            break;
        case 512:
            bgColor = "#edc850";
            break;
        case 1024:
            bgColor = "#edc53f";
            break;
        case 2048:
            bgColor = "#edc22e";
            break;
        default:
            bgColor = "#eee4da";
    }
    return bgColor;
};

p.createNum = function (x, y, num) {
    var ctx = this.ctx;
    x = (x * 2 + 1) * this.radius;
    y = (y * 2 + 1) * this.radius;
    ctx.beginPath();
    ctx.fillStyle = (num == 2 || num == 4) ? "#776e65" : "#f9f6f2";
    ctx.font = "30px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), x, y);
    ctx.closePath();
};

//比较两个位置是否重合
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
    document.onkeydown = function (e) {
        e = e || window.event;
        var code = e.keyCode || e.charCode;
        if (that.checkGameOver()) {
            alert("game over");
        }
        switch (code) {
            case 37:
                that.left();
                that.reDraw();
                that.addNewNum();
                break;
            case 38:
                that.up();
                that.reDraw();
                that.addNewNum();
                break;
            case 39:
                that.right();
                that.reDraw();
                that.addNewNum();
                break;
            case 40:
                that.down();
                that.reDraw();
                that.addNewNum();
                break;
        }
    }
};

p.mobileEvent = function () {
    var that = this;
    document.addEventListener("touchstart", function (e) {
        e.preventDefault();
        that.startX = e.touches[0].pageX;
        that.startY = e.touches[0].pageY;
    });
    
    document.addEventListener("touchmove", function (e) {
        e.preventDefault();
    })

    document.addEventListener("touchend", function (e) {
        that.endX = e.changedTouches[0].pageX;
        that.endY = e.changedTouches[0].pageY;

        var deltaX = that.endX - that.startX;
        var deltaY = that.endY - that.startY;

        if (that.checkGameOver()) {
            alert("game over");
        }

        if (Math.abs(deltaX) > 0.2 * window.innerWidth || Math.abs(deltaY) > 0.2 * window.innerWidth) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    that.right();
                    that.reDraw();
                    that.addNewNum();
                } else {
                    that.left();
                    that.reDraw();
                    that.addNewNum();
                }
            } else {
                if (deltaY > 0) {
                    that.down();
                    that.reDraw();
                    that.addNewNum();
                } else {
                    that.up();
                    that.reDraw();
                    that.addNewNum();
                }
            }
        }
    });
};

//增加数字
p.addNewNum = function () {
    var that = this;
    if (this.flag) {
        setTimeout(function () {
            that.drawNum();
        }, 80);
        this.flag = false;
    }
};

//重绘
p.reDraw = function () {
    var that = this;
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.createGrid();
    this.reDrawNum();
    setTimeout(function () {
        ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
        that.createGrid();
        that.reDrawNum();
    }, 100)
};

p.reDrawNum = function () {
    for (var i = 0; i < this.numNodes.length; i++) {
        var numNode = this.numNodes[i];
        var x = numNode.x;
        var y = numNode.y;
        var num = numNode.num;
//        numNode.isMerge && (numNode.isMerge = false);
        if (numNode.isMerge) {
            this.createNumBg(x, y, num, 0);
            numNode.isMerge = false;
        } else {
            this.createNumBg(x, y, num, 6);
        }

        this.createNum(x, y, num);
    }
};

p.down = function () {
    for (var x = 0; x < 4; x++) {
        for (var y = 3; y >= 0; y--) {
            var title = this.getPos(x, y);
            if (title && y < 3) {
                for (var z = y + 1; z < 4; z++) {
                    var title1 = this.getPos(x, z);
                    if (title1) {
                        if (title.num == title1.num && !title1.isMerge) {
                            title1.num = title1.num * 2;
                            title1.isMerge = true;
                            this.flag = true;
                            this.numNodes.splice(this.numNodes.indexOf(title), 1);
                        } else {
                            break;
                        }
                    } else {
                        this.flag = true;
                        title.y = title.y + 1;
                    }
                }
            }
        }
    }
};

p.up = function () {
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var title = this.getPos(x, y);
            if (title && y > 0) {
                for (var z = y - 1; z >= 0; z--) {
                    var title1 = this.getPos(x, z);
                    if (title1) {
                        if (title.num == title1.num && !title1.isMerge) {
                            title1.num = title1.num * 2;
                            //已经合并过的，避免再次合并
                            title1.isMerge = true;
                            this.flag = true;
                            this.numNodes.splice(this.numNodes.indexOf(title), 1);
                        } else {
                            break;
                        }
                    } else {
                        this.flag = true;
                        title.y = title.y - 1;
                    }
                }
            }
        }
    }
};

p.left = function () {
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            var title = this.getPos(x, y);
            if (title && x > 0) {
                for (var z = x - 1; z >= 0; z--) {
                    var title1 = this.getPos(z, y);
                    if (title1) {
                        if (title.num == title1.num && !title1.isMerge) {
                            title1.num = title1.num * 2;
                            title1.isMerge = true;
                            this.flag = true;
                            this.numNodes.splice(this.numNodes.indexOf(title), 1);
                        } else {
                            break;
                        }
                    } else {
                        this.flag = true;
                        title.x = title.x - 1;
                    }
                }
            }
        }
    }
};

p.right = function () {
    for (var y = 0; y < 4; y++) {
        for (var x = 3; x >= 0; x--) {
            var title = this.getPos(x, y);
            if (title && x < 3) {
                for (var z = x + 1; z < 4; z++) {
                    var title1 = this.getPos(z, y);
                    if (title1) {
                        if (title.num == title1.num && !title1.isMerge) {
                            title1.num = title1.num * 2;
                            title1.isMerge = true;
                            this.flag = true;
                            this.numNodes.splice(this.numNodes.indexOf(title), 1);
                        } else {
                            break;
                        }
                    } else {
                        this.flag = true;
                        title.x = title.x + 1;
                    }
                }
            }
        }
    }
};

p.getPos = function (x, y) {
    for (var i = 0; i < this.numNodes.length; i++) {
        var posX = this.numNodes[i].x;
        var posY = this.numNodes[i].y;
        if (posX === x && posY === y) {
            return this.numNodes[i];
        }
    }
    return false;
};

p.checkGameOver = function () {
    if (this.numNodes.length < 16) return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            var title = this.getPos(i, j);
            var other = this.getPos(i, j + 1);

            var title1 = this.getPos(j, i);
            var other1 = this.getPos(j + 1, i);
            if (title.num == other.num || title1.num == other1.num) {
                return false;
            }
        }
    }
    return true;

};
var game = new Game(document.querySelector("canvas"));
game.init();
