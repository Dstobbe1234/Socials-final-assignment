// Socials assignment

// JS variables
let preventDefault;
let mouseX, mouseY;
let dragBool = false;
let moveMap = false;
let numberOfRestaurants = 0;
let restaurantxlist = [];
let restaurantylist = [];
let money = 50;
let pMouseX, pMouseY;
let mouseMoveX, mouseMoveY;
let restaurantX, restaurantY
let worldX = 0;
let worldY = 0;
let worldCnvDifLeft
let worldCnvDifRight
let mapHeight = 700;
let mapWidth = 750;
let backgroundX = 0;
let backgroundY = 0;
let cnvX = backgroundX * -1;
let cnvY = backgroundY * -1;
let tiles = []
let x = 0
let randomInterval = 1000

let resources = 0


//Variables for HTML elements
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant");
let background = document.getElementById("background");
let amountEl = document.getElementById("amount");
let feedback = document.getElementById("feedback");
let grid = document.getElementById("grid");
let restaurantSum = document.getElementById("restaurantAmount");
let tradeMessage = document.getElementById("trade");


cnv.height = 700;
cnv.width = 750;

//Tile class for asset placement 
class tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "rgb(0, 0, 0)";
        this.status = "open";
        this.index = undefined;

    }

    draw() {
        randomInterval = Math.random() * 10000
        if (mapWidth === 1150) {
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.x, this.y, 57.5, 61.1)
            if (this.x <= mouseX && mouseX <= this.x + 58 && this.y <= mouseY && mouseY <= this.y + 61.1 && dragBool === true && this.status === "open") {
                document.addEventListener("mousedown", () => {
                    //if (this.x <= mouseX && mouseX <= this.x + 57.5 && this.y <= mouseY && mouseY <= this.y + 61.1) {
                        this.status = "occupied"
                    //}
                })
                ctx.drawImage(img, this.x - cnvX, this.y - cnvY, 57.5, 61.1)
                this.color = "rgb(0, 255, 0)"
            } else {
                this.color = "rgb(0, 0, 0)"
            }
            if (this.status === "occupied" && this.index === undefined) {
                this.index = restaurantxlist.length 
            }
            if (this.index !== undefined) {

                restaurantxlist.splice(this.index, 1, this.x - cnvX)
                restaurantylist.splice(this.index, 1, this.y - cnvY)
            }
        }
    }
}

//Event Listeners
buyBtn.addEventListener("click", drag);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("mouseup", mouseupHandler);
document.addEventListener("keydown", keydownHandler);

//Event Functions
function drag() {
    if (money >= 50 && mapWidth === 1150) {
        money -= 50;
        dragBool = true; 
        alert("EE")
    }
}

function mousemoveHandler(event) {
    pMouseX = mouseX;
    pMouseY = mouseY;
    mouseX = event.x;
    mouseY = event.y;
    mouseMoveX = mouseX - pMouseX;
    mouseMoveY = mouseY - pMouseY;
}

function mousedownHandler() {
    moveMap = true
    if (dragBool === true) {
        numberOfRestaurants++;
        dragBool = false;
    }

}

for (let n = 0; n <= 18; n++) {
    tiles.push(new tile(x, 0))
    x += 58
}

requestAnimationFrame(display);
function display() {
    restaurantSum.innerHTML = numberOfRestaurants;
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);
    tiles[0].x = backgroundX 
    tiles[0].y = backgroundY
    tiles[1].x = backgroundX + 58
    tiles[1].y = backgroundY
    tiles[2].x = backgroundX + (2 * 58)
    tiles[2].y = backgroundY
    tiles[3].x = backgroundX + (3 * 58)
    tiles[3].y = backgroundY
    tiles[4].x = backgroundX + (4 * 58)
    tiles[4].y = backgroundY

    tiles[0].draw()
    tiles[1].draw()
    tiles[2].draw()
    tiles[3].draw()
    tiles[4].draw()

    if (moveMap === true && mapWidth > 750 && mouseX >= 0 && mouseX <= 750 && mouseY >= 0 && mouseY <= 700) {
            backgroundX += mouseMoveX;
            backgroundY += mouseMoveY;
    }

    if (backgroundX > 0 && backgroundX + mapWidth > 750) {
        backgroundX = 0
    } else if (backgroundX < 0 && backgroundX + mapWidth < 750) {
        backgroundX = 750 - mapWidth;
    }

    if (backgroundY < 0 && backgroundY + mapHeight < 700) {
        backgroundY = 700 - mapHeight
    } else if (backgroundY > 0 && backgroundY + mapHeight > 700) {
        backgroundY = 0
    }

    if (numberOfRestaurants > 0) {
        for (let n = restaurantxlist.length -1 ; n >= 0; n--) {
            ctx.drawImage(img, restaurantxlist[n], restaurantylist[n], 57.5, 61.1);
        }
    }
    if (money >= 50) {
        buyBtn.classList.add("available");
    } else {
        buyBtn.classList.remove("available");
    }
    requestAnimationFrame(display);
}

function changeMoney() {
    money += 2 * numberOfRestaurants;
    amountEl.innerHTML = money;
}
setInterval(changeMoney, 100);

function mouseupHandler() {
    moveMap = false;
}

function keydownHandler(event) {
    if (event.code === "Equal") {
        if (mapWidth !== 1150) {
            mapWidth += 400;
            mapHeight += 400;
        }
    } else if (event.code === "Minus") {
        if (mapWidth > 750) {
            backgroundX = 0;
            backgroundY = 0;
            mapWidth -= 400;
            mapHeight -= 400;
        }
    }
}

function tradeWood() {
    console.log(randomInterval)
    ctx.drawImage(tradeMessage, Math.random() * 50, Math.random() * 50, 100, 100)
    setTimeout(tradeWood, randomInterval)
}
tradeWood()

