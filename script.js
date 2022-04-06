// Socials assignment

// Set up canvas
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = cnv.width * 0.6;

// Global variables
let preventDefault;
let mouseX, mouseY;
let dragRestaurant = false;
let numberOfRestaurants = 0;
let restaurantxlist = [];
let restaurantylist = [];
let money = 50;
let restaurantX, restaurantY
let worldX = 0;
let worldY = 0;
let mapHeight = cnv.height;
let mapWidth = cnv.width;
let backgroundX = 0;
let backgroundY = 0;
let tiles = []
let randomInterval = (Math.random() * 10000).toFixed()
let randomX, randomY;
let randomIndex
let repetition = 0;
let reputation = 1;
let trade = false;
let ratio = 0
let tryNextFrame = false;

// Variables for HTML elements
let buyBtn = document.getElementById("buy");
let restaurantImg = document.getElementById("restaurant");
let background = document.getElementById("background");
let amountEl = document.getElementById("amount");
let grid = document.getElementById("grid");
let restaurantSum = document.getElementById("restaurantAmount")
let trade1 = document.getElementById("trade");
let possibleTrades = [trade1]
let competition

//Tile class for asset placement 
class tile {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "rgb(0, 0, 0)";
        this.status = "open";
        this.index;
        this.competition = false

    }

    draw() {
        if (this.competition === true) {
            ctx.drawImage(restaurantImg, this.x, this.y, this.w, this.h)
        }
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x + backgroundX, this.y + backgroundY, this.w, this.h);
        if (mouseX > this.x + backgroundX && mouseX < this.x + this.w + backgroundX && mouseY > this.y + backgroundY && mouseY < this.y + this.h + backgroundY && dragRestaurant === true && this.status === "open") {
            ctx.drawImage(restaurantImg, this.x + backgroundX, this.y + backgroundY, this.w, this.h);
            this.color = "rgb(0, 255, 0)";
            document.addEventListener("mousedown", () => {
                if (mouseX > this.x + backgroundX && mouseX < this.x + this.w + backgroundX && mouseY > this.y + backgroundY && mouseY < this.y + this.h + backgroundY && dragRestaurant === true && this.status === "open") {
                    this.status = "occupied";
                    dragRestaurant = false;

                }
            })
        } else {
            this.color = "rgb(0, 0, 0)";
        }
        if (this.status == "occupied" && this.index === undefined && this.competition === false) {
            this.index = restaurantxlist.length;
        }
        if (this.index !== undefined) {
            restaurantxlist.splice(this.index, 1, this.x + backgroundX);
            restaurantylist.splice(this.index, 1, this.y + backgroundY);
        }
    }
}

//Event Listeners
buyBtn.addEventListener("click", drag);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mousemove", mousemoveHandler);
background.addEventListener('load', createTiles);

//Event Functions
function drag() {
    if (money >= 50) {
        money -= 50;
        dragRestaurant = true;
    }
}

function mousedownHandler() {
    if (dragRestaurant === true) {
        numberOfRestaurants++;
    }
}

function mousemoveHandler(event) {
    mouseX = event.x - cnv.getBoundingClientRect().x;
    mouseY = event.y - cnv.getBoundingClientRect().y;
}

// Checks if a tile would have water in it and if not then creates it
function createTiles() {
    let testImageData = ctx.getImageData(0, 0, 1, 1);
    let rTest = testImageData.data[1];
    let gTest = testImageData.data[2];
    let bTest = testImageData.data[3];
    if (!(rTest === 0 && gTest === 0 && bTest === 0)) {
        tryNextFrame = false;
        for (let y = 0; y < cnv.height; y += 20, x = 0) {
            for (let x = 0; x < cnv.width; x += 20) {
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
                    tiles.push(new tile(x, y, 20, 20));
                }
            }
        }
        for(x = 0; x <= tiles.length - 1; x ++) {
            competition = Math.random() * 100;
            if (competition <= 50) {
                tiles[x].competition = true;
                tiles[x].status = "occupied";
                console.log("EEE");
            }
        }
    } else {
        tryNextFrame = true;
    }
}

// Animation loop
requestAnimationFrame(display);

function display() {
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);

    // Draw all the tiles
    for (let x = 0; x < tiles.length; x++) {
        tiles[x].draw();
    }
    // Decide when to show a trade request
    repetition++;
    if (repetition == randomInterval) {
        randomIndex = tiles[Math.round(Math.random() * 310)]
        randomX = randomIndex.x
        randomY = randomIndex.y
        trade = true
    }
    if (trade = true) {
        for (let n = 0; n <= 100; n++) {
            ctx.drawImage(trade1, randomX, randomY, 20, 20);
            randomInterval = (Math.random() * 100).toFixed();
        }
        repetition = 0
        trade = false
    }
    restaurantSum.innerHTML = numberOfRestaurants;

    if (numberOfRestaurants > 0) {
        for (let n = restaurantxlist.length - 1; n >= 0; n--) {
            ctx.drawImage(restaurantImg, restaurantxlist[n], restaurantylist[n], 20, 20);
        }
    }
    if (money >= 50) {
        buyBtn.classList.add("available");
    } else {
        buyBtn.classList.remove("available");
    }

    // Retry making the tiles if the image wasn't loaded before
    if (tryNextFrame) {
        createTiles();
    }
    requestAnimationFrame(display);
}

function changeMoney() {
    money += 2 * numberOfRestaurants;
    amountEl.innerHTML = money;
}
setInterval(changeMoney, 100);

function taxes() {
    console.log("TAXES\nTotal:\n");
}
setInterval(taxes, 180000)