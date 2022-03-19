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
//Variables for HTML elements
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant");
let background = document.getElementById("background");
let amountEl = document.getElementById("amount");
let feedback = document.getElementById("feedback");
let grid = document.getElementById("grid");
let mapHeight = 700;
let mapWidth = 750;
let backgroundX = 0;
let backgroundY = 0;
let cnvX = backgroundX * -1;
let cnvY = backgroundY * -1;

cnv.height = 700;
cnv.width = 750;

//Tile class for asset placement 
class tile {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.status = "open";
        this.index = undefined;

    }

    draw() {
        if (mapWidth === 1150) {
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.x, this.y, 57.5, 61.1)
            if (this.x <= mouseX && mouseX <= this.x + 57.5 && this.y <= mouseY && mouseY <= this.y + 61.1 && dragBool === true) {
                document.addEventListener("mousedown", () => {
                    if (this.x <= mouseX && mouseX <= this.x + 57.5 && this.y <= mouseY && mouseY <= this.y + 61.1) {
                        this.status = "occupied"
                    }
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
        document.addEventListener("mousemove", mousemoveHandler);
        dragBool = true; 
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


let tile1 = new tile(0, 0, "rgb(0, 0, 0)")
let tile2 = new tile(57.5, 0, "rgb(0, 0, 0)")

requestAnimationFrame(display);
function display() {

    tile1.x = backgroundX
    tile2.x = backgroundX + 57.5
    tile1.y = backgroundY
    tile2.y = backgroundY
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);

    tile1.draw()
    tile2.draw()
    if (moveMap === true && mapWidth > 750) {
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

function drawRestaurant() {
    ctx.drawImage(img, this.x, this.y, 57.5, 61.1)
    requestAnimationFrame(drawRestaurant)
}

