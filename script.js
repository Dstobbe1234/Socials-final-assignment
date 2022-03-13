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
ctx.strokeStyle = "white"
cnv.height = 700;
cnv.width = 750;

//Tile class for asset placement 
class tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        if (mapWidth >= 800)
        ctx.strokeRect(this.x, this.y, mapWidth / 20, mapHeight / 18)
    }
    displaygreen() {
        if (this.x <= mouseX <= this.x + (mapWidth / 20) && this.y <= mouseY <= this.y + (mapWidth / 18)) {
            console.log(this.x)
            ctx.strokeStyle = "rgb(0, 255, 0)"
        }
    }
}
let tile1 = new tile(0, 0);

//Event Listeners
buyBtn.addEventListener("click", drag);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("mouseup", mouseupHandler);
document.addEventListener("keydown", keydownHandler);

//Event Functions
function drag() {
    if (money >= 50) {
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
        restaurantxlist.push(mouseX - 50);
        restaurantylist.push(mouseY - 50);
        numberOfRestaurants++;
        dragBool = false;
    }

}

requestAnimationFrame(display);
function display() {
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);
    tile1.draw()
    tile1.displaygreen()
    if (moveMap === true && mapWidth > 750) {
        backgroundX += mouseMoveX;
        backgroundY += mouseMoveY;
    }
    if (numberOfRestaurants > 0) {
        for (let n = restaurantxlist.length; n >= 0; n--) {
            ctx.drawImage(img, restaurantxlist[n], restaurantylist[n], 100, 100);
        }
    } if (money >= 50) {
        buyBtn.classList.add("available");
    } else {
        buyBtn.classList.remove("available");
    }
    if (dragBool === true) {
        ctx.drawImage(img, mouseX - 50, mouseY - 50, 100, 100);
        document.addEventListener("mousedown", mousedownHandler);
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
        mapWidth += 10;
        mapHeight += 10;
    } else if (event.code === "Minus") {
        mapWidth -= 10;
        mapHeight -= 10;
    }
}

