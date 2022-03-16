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
let cnvX = 0;
let cnvY = 0;
let worldX = 0;
let worldY = 0;

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
cnv.height = 700;
cnv.width = 750;

//Tile class for asset placement 
class tile {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw() {
        if (mapWidth === 1150) {
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.x, this.y, 57.5, 61.1)
            if (this.x <= mouseX && mouseX <= this.x + 57.5 && this.y <= mouseY && mouseY <= this.y + 61.1 && dragBool === true) {
                this.status = "taken"
                worldX = this.x
                worldY = this.y
                document.addEventListener("mousedown", mousedownHandler)
                ctx.drawImage(img, worldX - cnvX, worldY - cnvY, 57.5, 61.1);
                this.color = "rgb(0, 255, 0)"
            } else {
                this.color = "rgb(0, 0, 0)"
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
    console.log("restaurant X = " + restaurantX)
    if (dragBool === true) {
        restaurantxlist.push(worldX - cnvX);
        restaurantylist.push(worldY - cnvY);
        numberOfRestaurants++;
        dragBool = false;
    }

}

requestAnimationFrame(display);
function display() {
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);
    let tile1 = new tile(backgroundX, backgroundY, "rgb(0, 0, 0)");
    let tile2 = new tile(backgroundX + 57.5, backgroundY, "rgb(0, 0, 0)");
    tile1.draw()
    tile2.draw()
    if (moveMap === true && mapWidth > 750) {
            backgroundX += mouseMoveX;
            backgroundY += mouseMoveY;
            cnvX += mouseMoveX
            cnvY += mouseMoveY
    }

    if (backgroundX > 0 && backgroundX + mapWidth > 750) {
        console.log("EEEEEEE")
        backgroundX = 0
    } else if (backgroundX < 0 && backgroundX + mapWidth < 750) {
        console.log("ee")
        backgroundX = 750 - mapWidth;
    }

    if (backgroundY < 0 && backgroundY + mapHeight < 700) {
        console.log("RRR")
        backgroundY = 700 - mapHeight
    } else if (backgroundY > 0 && backgroundY + mapHeight > 700) {
        backgroundY = 0
    }

    if (numberOfRestaurants > 0) {
        for (let n = restaurantxlist.length; n >= 0; n--) {
            ctx.drawImage(img, restaurantxlist[n], restaurantylist[n], 57.5, 61.1);
        }
    } if (money >= 50) {
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
setInterval(changeMoney, 1000);

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

