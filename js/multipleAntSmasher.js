
var DIRECTION = [-5,-4,-3,3,4,5];
var MAXSPEED = 3;
var MAXWIDTH = 500 - 50;
var MAXHEIGHT = 500 - 50;
var WIDTHS = [50,60,70];
var MASS = [30,40,50];
var BOXCOLOR = ['green','orange','pink'];

function getRandomNumber(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) ) + min;
}

class Box {
    constructor(gameWindow){
        this.parentElement = gameWindow;
        this.boxElement = null;
        this.x = null;
        this.y = null;
        this.diameter = null;
        this.backgroundColor = null;
        this.dx = 1;
        this.dy = 1;
        this.MASS = null;
    }

    setSize(d){
        this.diameter = d;
    }

    setMass(index){
        this.MASS = MASS[index];
    }

    setPosition(x,y){
        this.x = x;
        this.y = y;
    }

    setDirection(dx,dy){
        this.dx = dx;
        this.dy = dy;
    }

    reverseXDirection(){
        this.dx*=-1;
    }

    reverseYDirection(){
        this.dy*=-1;
    }

    changeBoxVelocity(box){
        var change = this.dx * (this.diameter/box.diameter);
        this.dx = box.dx * (box.diameter/this.diameter);
        box.dx = change;

        change = this.dy * (this.diameter / box.diameter);
        this.dy = box.dy * (box.diameter / this.diameter);
        box.dy = change;

        this.move();
        box.move();
    }

    checkWallCollisionX(){
        if((this.x + (2.3 * this.diameter)) >= 500 || (this.x <= 0)){
            return true;
        }
        else{
            return false;
        }
    }

    checkWallCollisionY(){
        if(((this.y + (2.3 * this.diameter)) >= 500) || ((this.y - this.diameter) <= 0)){
            return true;
        }
        else{
            return false;
        }
    }

    move(){
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        this.draw();
    }

    create(){
        this.boxElement = document.createElement('div');
        this.boxElement.classList.add('box-style');
        this.parentElement.appendChild(this.boxElement);
    }

    draw(){
        this.boxElement.style.left = this.x + 'px';
        this.boxElement.style.top = this.y + 'px';
        this.boxElement.style.width = this.diameter + 'px';
        this.boxElement.style.height = this.diameter + 'px';
        this.boxElement.style.backgroundColor = this.backgroundColor;
    }
}

class Game{
    constructor(boxCount,parentElementClass,FPS){
        this.MAXHEIGHT = MAXHEIGHT;
        this.MAXWIDTH = MAXWIDTH;
        this.boxCount = boxCount;
        this.ANIMATIONFRAME = FPS;
        this.BOXCOLOR = BOXCOLOR;
        this.scoreCount = 0;
        this.parentElement = document.getElementsByClassName(parentElementClass)[0];

        this.gameWrapper = document.createElement('div');
        this.gameWindow = document.createElement('div');
        this.scoreBoard = document.createElement('div');

        this.gameWrapper.classList.add('game-wrapper')
        this.scoreBoard.classList.add('score-count');
        this.gameWindow.classList.add('game-box');
        // console.log(this.gameWindow);
        this.showScore();
        
        this.parentElement.appendChild(this.gameWrapper);
        this.gameWrapper.appendChild(this.scoreBoard);
        this.gameWrapper.appendChild(this.gameWindow);
        this.boxes = [];
        this.createBoxes();
        this.antSmash();
    }

    createBoxes(){
        for(var i = 0;i<this.boxCount;i++){
            var box= new Box(this.gameWindow);
            var boxSize = 50;
            var x = getRandomNumber(0,this.MAXWIDTH - boxSize);
            var y = getRandomNumber(0, this.MAXHEIGHT - boxSize);
            
            var rand1 = getRandomNumber(2 ,5);
            var rand2 = getRandomNumber(2 ,5);

            var colorIndex = getRandomNumber(0,this.BOXCOLOR.length);

        
            box.setPosition(x,y);
            box.setSize(boxSize);
            box.setDirection(rand1, rand2);
            box.setMass(colorIndex);
            box.create();
            box.draw();
            this.boxes.push(box);
        }
    }

    detectboxCollision(box1, box2){
        var sumOfRadius = (box1.diameter/2 + box2.diameter/2);
        var x1 = box1.x + (box1.diameter/2);
        var x2 = box2.x + (box2.diameter/2);
        var y1 = box1.y + (box1.diameter/2);
        var y2 = box2.y + (box2.diameter/2);

        var distance =  Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);

        if (distance <= (Math.pow(sumOfRadius,2))){
            console.log('true');
            return true;
        }
        else{
            return false;
        }
    }

    detectAllCollision(){
        for(var j = 0; j < (this.boxes.length); j++){
            for(var k = 0; k < (this.boxes.length); k++){
                if(j != k){
                    if(this.detectboxCollision(this.boxes[j],this.boxes[k])){
                        this.boxes[j].changeBoxVelocity(this.boxes[k]);
                    }
                }
            }
        }
    }

    antSmash(){
        var gameDOM = this.gameWindow.children;
        console.log(gameDOM.length);
        console.log(gameDOM);
        for( let m = 0; m< gameDOM.length; m++){
            console.log(gameDOM[m]);
            gameDOM[m].onclick = function(){
                console.log('inside onclick');
                this.boxes.splice(m,1);
                this.boxCount--;
                this.gameWindow.removeChild(gameDOM[m]);
                this.scoreCount++;
                console.log(this.scoreCount);
            }.bind(this);
        }
    }

    showScore(){
        this.scoreBoard.innerHTML = 'Score : ' + this.scoreCount;
    }

    moveBoxes(){
        var that = this;
        
        var interval = setInterval(function(){
            for(var i = 0;i<that.boxCount;i++){
                if(that.boxes[i].checkWallCollisionX()){
                    that.boxes[i].reverseXDirection();
                }
                if(that.boxes[i].checkWallCollisionY()){
                    that.boxes[i].reverseYDirection();
                }
                that.boxes[i].move();
            }
            that.antSmash();
            that.showScore();
            that.detectAllCollision();
        },1000/this.ANIMATIONFRAME)
    }
}

game1 = new Game(15,'game-area',5);
game2 = new Game(10,'game-area',10);
game1.moveBoxes();
game2.moveBoxes();



