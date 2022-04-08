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
let numberOfRestaurants = 1;
let restaurantxlist = [];
let restaurantylist = [];
let money = 0;
let restaurantX, restaurantY
let worldX = 0;
let worldY = 0;
let mapHeight = cnv.height;
let mapWidth = cnv.width;
let backgroundX = 0;
let backgroundY = 0;
let tiles = []
let randomInterval = (Math.random() * 1000).toFixed()
let randomX, randomY;
let randomIndex
let repetition = 0;
let reputation = 1;
let ratio = 0
let tryNextFrame = true;
let trade = false;
let americas = [];
let africaMiddleEast = [];
let eurasia = [];
let australia = [];
let clouds = [];
const tileSize = 20;
let africaClouds = true;
let australiaClouds = true;
let eurasiaClouds = true;

// Variables for HTML elements
let buyBtn = document.getElementById("buy");
let restaurantImg = document.getElementById("restaurant");
let background = document.getElementById("background");
let cloudsImg = document.getElementById("clouds-img");
let amountEl = document.getElementById("amount");
let grid = document.getElementById("grid");
let restaurantSum = document.getElementById("restaurantAmount");
let trade1 = document.getElementById("trade");
let taxModalEl = document.getElementById("taxesModal");
let taxesAmt = document.getElementById("taxes");
let modalBtn = document.getElementById("hide");
let possibleTrades = [trade1];
let competition;

//Tile class for placing stuff
class tile {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "rgb(0, 0, 0)";
        this.status = "open";
        this.index;
        this.startingStore = false

    }

    draw() {
        if (this.startingStore === true) {
            ctx.drawImage(restaurantImg, this.x, this.y, this.w, this.h)
        }
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && dragRestaurant === true && this.status === "open") {
            ctx.drawImage(restaurantImg, this.x, this.y, this.w, this.h);
            this.color = "rgb(0, 255, 0)";
            document.addEventListener("mousedown", () => {
                if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && dragRestaurant === true && this.status === "open") {
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
            restaurantxlist.splice(this.index, 1, this.x);
            restaurantylist.splice(this.index, 1, this.y);
        }
    }
}

class cloud {
    constructor(tileIndex, continent) {
        this.w = 60;
        this.continent = continent
        this.h = this.w * 0.9;
        this.timer = 0;
        if (this.continent === "australia") {
            this.x = australia[tileIndex].x - (this.w / 2) + (tileSize / 2);
            this.y = australia[tileIndex].y - (this.h / 2) + (tileSize / 2);
        } else if (this.continent === "eurasia") {
            this.x = eurasia[tileIndex].x - (this.w / 2) + (tileSize / 2);
            this.y = eurasia[tileIndex].y - (this.h / 2) + (tileSize / 2);
        } else if (this.continent === "africaMiddleEast") {
            this.x = africaMiddleEast[tileIndex].x - (this.w / 2) + (tileSize / 2);
            this.y = africaMiddleEast[tileIndex].y - (this.h / 2) + (tileSize / 2);
        }
    }

    draw() {
        this.timer++;
        if (this.timer === 10) {
            this.timer = 0;
            this.cloudX = Math.floor(Math.random() * 4);
            this.cloudY = Math.floor(Math.random() * 3);
        }
        ctx.drawImage(cloudsImg, 165 * this.cloudX, 135 * this.cloudY, 165, 135, this.x, this.y, this.w, this.h);
    }
}

//Event Listeners
buyBtn.addEventListener("click", drag);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mousemove", mousemoveHandler);
background.addEventListener('load', createTiles);
modalBtn.addEventListener("click", payTaxes)

taxModalEl.style.display = "none"

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
                    if (x >= 0 && x <= 410 && y >= 0 && y <= 550) {
                        americas.push(new tile(x, y, 20, 20))
                    } else if (x >= 410 && x <= 630 && y >= 258 && y <= 508) {
                        africaMiddleEast.push(new tile(x, y, tileSize, tileSize))
                    } else if (x >= 410 && x <= 940 && y >= 20 && y <= 370 && africaMiddleEast.includes(new tile(x, y, tileSize, tileSize)) === false) {
                        eurasia.push(new tile(x, y, tileSize, tileSize))
                    } else if (x >= 770 && x <= 970 && y >= 400 && y <= 550) {
                        australia.push(new tile(x, y, tileSize, tileSize))
                    }
                }
            }
        }
        // randomly generate competition on roughly one third of the tiles
        //for(x = 0; x <= tiles.length - 1; x ++) {
        //competition = Math.random() * 100;
        //if (competition <= 25) {
        //tiles[x].competition = true;
        //tiles[x].status = "occupied";
        //console.log("EEE");
        //}
        //}
        let randomIndex = Math.round(Math.random() * americas.length - 1)
        tiles[randomIndex].status = "occupied";
        tiles[randomIndex].startingStore = true;
        createClouds();
        console.log(australia)
        console.log(americas)
        console.log(eurasia)
        console.log(africaMiddleEast)
    } else {
        tryNextFrame = true;
    }
}

function createClouds() {
    for (let n = 0; n < eurasia.length; n++) {
        clouds.push(new cloud(n, "eurasia"));
    }

    for (let n = 0; n < australia.length; n++) {
        clouds.push(new cloud(n, "australia"));
    }

    for (let n = 0; n < africaMiddleEast.length; n++) {
        clouds.push(new cloud(n, "africaMiddleEast"))
    }
}

// Animation loop
requestAnimationFrame(display);

function display() {
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);

    // Draw all the tiles
    for (let n = 0; n < tiles.length; n++) {
        tiles[n].draw();
    }

    // Draw all the clouds
    for (let n = 0; n < clouds.length; n++) {
        clouds[n].draw();
    }

    // Decide when to show a trade request
    repetition++;
    if (repetition == randomInterval) {
        randomIndex = tiles[Math.round(Math.random() * 310)]
        randomX = randomIndex.x
        randomY = randomIndex.y
        trade = true
        repetition = 0
        randomInterval = (Math.random() * 1000).toFixed()
    }

    if (trade === true) {
        for (let n = 0; n <= 100; n++) {
            ctx.drawImage(trade1, randomX, randomY, 20, 20);
        }
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
    taxModalEl.style.display = "block"
    //console.log("TAXES\nTotal:\n");
}
setInterval(taxes, 180000)

function payTaxes() {
    taxModalEl.style.display = "none"
}