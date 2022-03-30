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
let randomInterval = (Math.random() * 10000).toFixed()
let randomX, randomY;
let randomIndex
let repetition = 0;
let reputation = 1;
let y = x = 0;
let zoomedIn = false;
let trade = false;
let ratio = 0



//Variables for HTML elements
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant");
let background = document.getElementById("background");
let amountEl = document.getElementById("amount");
let grid = document.getElementById("grid");
let restaurantSum = document.getElementById("restaurantAmount")
let trade1 = document.getElementById("trade");

let possibleTrades = [trade1]

cnv.height = 700;
cnv.width = 750;

//Tile class for asset placement 
class tile {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = "rgb(0, 0, 0)";
        this.status = "open";
        this.index;

    }

    draw() {
        if (zoomedIn) {
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x + backgroundX, this.y + backgroundY, this.w, this.h);
            if (mouseX > this.x + backgroundX && mouseX < this.x+ this.w + backgroundX && mouseY > this.y + backgroundY && mouseY < this.y + this.h + backgroundY && dragBool === true && this.status === "open") {
                ctx.drawImage(img, this.x + backgroundX, this.y + backgroundY, this.w, this.h);
                this.color = "rgb(0, 255, 0)";
                document.addEventListener("mousedown", () => {
                if (mouseX > this.x + backgroundX && mouseX < this.x+ this.w + backgroundX && mouseY > this.y + backgroundY && mouseY < this.y + this.h + backgroundY && dragBool === true && this.status === "open") {
                   this.status = "occupied"; 
                   dragBool = false;

                }
                })
            } else {
                this.color = "rgb(0, 0, 0)";
            }
            if (this.status == "occupied" && this.index === undefined) {
                this.index = restaurantxlist.length;
            }
            if (this.index !== undefined) {
                restaurantxlist.splice(this.index, 1, this.x + backgroundX);
                restaurantylist.splice(this.index, 1, this.y + backgroundY);
                console.log(restaurantxlist)
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
    if (money >= 50) {
        money -= 50;
        dragBool = true;
    }
}

function mousemoveHandler(event) {
    pMouseX = mouseX;
    pMouseY = mouseY;
    mouseX = event.x - cnv.getBoundingClientRect().x;
    mouseY = event.y - cnv.getBoundingClientRect().y;
    mouseMoveX = mouseX - pMouseX;
    mouseMoveY = mouseY - pMouseY;
}

function mousedownHandler() {
    moveMap = true
    if (dragBool === true) {
        numberOfRestaurants++;
    }

}

requestAnimationFrame(display);

function display() {
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);
    // Draw all tiles

    for (let y = 0; y <= 751; y += 50) {
        for (let x = 0; x <= 701; x += 50) {
            ctx.fillRect(x, y, 800, 1)
        }
    }

    for (let y = 0; y <= 751; y += 50) {
        for (let x = 0; x <= 701; x += 50) {
            ctx.fillRect(x, y, 1, 800)
        }
    }


    for (let x = 0; x < tiles.length; x++) {
        tiles[x].draw();
    }
    repetition++;
    if (repetition == randomInterval) {
        randomIndex = (Math.random() * 2).toFixed();
        randomX = tiles[Math.round(Math.random() * 263)].x;
        randomY = tiles[Math.round(Math.random() * 263)].y;
        trade = true
    }

    if (trade = true) {
        for (let n= 0; n <= 100; n++) {
            ctx.drawImage(trade1, randomX + backgroundX, randomY + backgroundY, 100, 200);
            randomInterval = (Math.random() * 100).toFixed();
        }
        repetition = 0
        trade = false
    }
    restaurantSum.innerHTML = numberOfRestaurants;

    if (moveMap === true && zoomedIn && mouseX >= 0 && mouseX <= 750 && mouseY >= 0 && mouseY <= 700) {
        backgroundX += mouseMoveX;
        backgroundY += mouseMoveY;
    }

    if (backgroundX > 0 && backgroundX + mapWidth > 750) {
        backgroundX = 0;
    } else if (backgroundX < 0 && backgroundX + mapWidth < 750) {
        backgroundX = 750 - mapWidth;
    }

    if (backgroundY < 0 && backgroundY + mapHeight < 700) {
        backgroundY = 700 - mapHeight;
    } else if (backgroundY > 0 && backgroundY + mapHeight > 700) {
        backgroundY = 0;
    }

    if (numberOfRestaurants > 0) {
        for (let n = restaurantxlist.length - 1; n >= 0; n--) {
            ctx.drawImage(img, restaurantxlist[n], restaurantylist[n], 20 * 2, 20 * 2);
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
        if (!zoomedIn) {
            mapWidth *= 2;
            mapHeight *= 2;
            zoomedIn = true;
            ratio = 0
        }
    } else if (event.code === "Minus") {
        if (zoomedIn) {
            backgroundX = 0;
            backgroundY = 0;
            mapWidth /= 2;
            mapHeight /=2;
            zoomedIn = false
            ratio = 2
        }
    }
}

function createTiles() {
        for (; y < cnv.height; y += 20, x = 0) {
            for (; x < cnv.width; x += 20) {
                ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);
                let imageData = ctx.getImageData(x, y, 20, 20);
                let containsOcean = false;
                let r, g, b;

                for (var i = 0; i + 3 < imageData.data.length; i += 4) {
                    r = imageData.data[i];
                    g = imageData.data[i + 1];
                    b = imageData.data[i + 2];

                    if (r === 55 && g === 83 && b === 218) {
                        containsOcean = true;
                    }
                }
                if (!containsOcean) {
                    tiles.push(new tile(x * 2, y * 2, 20 * 2, 20 * 2));
                }
            }
        }
}

window.onload = createTiles()

function taxes() {
alert("TAXES\nTotal:\n")
}
setInterval(taxes, 180000)



