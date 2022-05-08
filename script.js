// Socials assignment

// Set up canvas
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = cnv.width * 0.6;


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
let boat = document.getElementById("boat");
let buyBoatBtn = document.getElementById("buyBoat")

// Global variables
let preventDefault;
let mouseX, mouseY;
let dragRestaurant = false;
let numberOfRestaurants = 1;
let restaurantxlist = [];
let restaurantylist = [];
let money = 0;
let mapHeight = cnv.height;
let mapWidth = cnv.width;
let backgroundX = 0;
let backgroundY = 0;
let randomInterval = (Math.random() * 1000).toFixed()
let randomX, randomY;
//let randomIndex
let repetition = 0;
let reputation = 1;
let ratio = 0
let tryNextFrame = true;
let americas = [];
let africaMiddleEast = [];
let eurasia = [];
let australia = [];
let nAmerica = []
let sAmerica = []
let tiles = [eurasia, australia, africaMiddleEast, sAmerica, nAmerica]
let clouds = [];
const tileSize = 20;
let africaClouds = true;
let australiaClouds = true;
let eurasiaClouds = true;
let sAmericaClouds = true;
let boatDrag = false;
let competition;
let possibleTrades = [trade1];
let displayLength = 1000
let displayDuration = 0
let trade = false
let preventDuplicates = false
let competitionGrowthInterval = Math.round(Math.random() * 100000)
let competitionGrowthDuration = 0 
let availableTiles = []

//Event Listeners

buyBtn.addEventListener("click", drag);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mousemove", mousemoveHandler);
background.addEventListener("load", createTiles);
modalBtn.addEventListener("click", payTaxes)
buyBoatBtn.addEventListener("click", boatPlace)

taxModalEl.style.display = "none"

//Tile class for placing stuff
class tile {
    constructor(x, y, w, h, continent) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "rgb(0, 0, 0)";
        this.status = "open";
        this.index;
        this.startingStore
        this.competition = false
        this.continent = continent

    }

    draw() {
        if (this.startingStore) {
            this.status = "occupied"
            ctx.drawImage(restaurantImg, this.x, this.y, this.w, this.h)
        } else if (this.competition) {
            this.status = "occupied"
            document.addEventListener("mousedown", () => {
                if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && this.competition) {
                    console.log("Buy: 100$")
                }
            })
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
                    numberOfRestaurants++
                }
            })
        } else if(mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && this.status === "occupied" && dragRestaurant === true) {
            this.color = "rgb(255, 0, 0)";
        } else {
            this.color = "rgb(0, 0, 0)";
        }
        if (this.status == "occupied" && this.index === undefined && this.startingStore === undefined && this.competition === false) {
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
        } else if (this.continent === "sAmerica") {
            this.x = sAmerica[tileIndex].x - (this.w / 2) + (tileSize / 2);
            this.y = sAmerica[tileIndex].y - (this.h / 2) + (tileSize / 2);
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

//Event Functions
function drag() {
    if (money >= 50) {
        money -= 50;
        dragRestaurant = true;
    }
}

function mousedownHandler() {
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
    if (!(rTest === 0 && gTest === 0 && bTest === 0) && preventDuplicates === false) {
        tryNextFrame = false;
        preventDuplicates = true
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
                if (!containsOcean) {;
                    if (x >= 250 && x <= 400 && y >= 350 && y <= 550) {
                        sAmerica.push(new tile(x, y, tileSize, tileSize, "sAmerica"))
                    } else if (x >= 410 && x <= 630 && y >= 258 && y <= 508) {
                        africaMiddleEast.push(new tile(x, y, tileSize, tileSize, "africaMiddleEast"))
                    } else if (x >= 410 && x <= 940 && y >= 20 && y <= 370 && africaMiddleEast.includes(new tile(x, y, tileSize, tileSize, "occupied")) === false) {
                        eurasia.push(new tile(x, y, tileSize, tileSize, "eurasia"))
                    } else if (x >= 770 && x <= 970 && y >= 400 && y <= 550) {
                        australia.push(new tile(x, y, tileSize, tileSize, "australia"))
                    } else {
                        nAmerica.push(new tile(x, y, tileSize, tileSize, "nAmerica"))
                    }
                }
            }
        }
        createClouds();
        let randomIndex = Math.floor(Math.random() * nAmerica.length)
        nAmerica[randomIndex].startingStore = true;
        let open = false
        
        // Loops until it finds an available tile (so that it doesn't end up on startingStore)
        while(!open) {
            randomIndex = Math.round(Math.random() * nAmerica.length)
            if (tiles[4][randomIndex].status === "open") {
                open = true
                nAmerica[randomIndex].competition = true
            }
        }
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
    for (let n = 0; n < sAmerica.length; n++) {
        clouds.push(new cloud(n, "sAmerica"))
    }
}

// Animation loop
requestAnimationFrame(display);

function display() {
    // Draw world map
    ctx.drawImage(background, backgroundX, backgroundY, mapWidth, mapHeight);

    //Draw all the tiles
    for (let n = 0; n < tiles.length; n++) {
        for(let m = 0; m < tiles[n].length; m++) {
            tiles[n][m].draw();
        }
    }
    // Draw all the clouds
    for (let n = 0; n < clouds.length; n++) {
        clouds[n].draw();
    }

    if (!eurasiaClouds)
        for(let n = 0; n < clouds.length; n ++) {
            if (clouds[n].continent === "eurasia") {
                clouds.splice(n, 1)
            }
        }
    // Decide when to show a trade request
    repetition++;
    if (repetition == randomInterval) {
        let randomIndex = nAmerica[Math.round(Math.random() * nAmerica.length)]
        randomX = randomIndex.x
        randomY = randomIndex.y
        trade = true
    }

    if (trade === true) {
        ctx.drawImage(trade1, randomX, randomY, 20, 20);
        displayDuration ++
        if (displayDuration == displayLength) {
            trade = false
            displayDuration = 0
            repetition = 0
            randomInterval = (Math.random() * 1000).toFixed()
        }
    }
    restaurantSum.innerHTML = numberOfRestaurants;


    for (let n = 0; n < tiles.length; n++) {
        for(let m = 0; m < tiles[n].length; m++) {
            if (availableTiles.find(element => element === tiles[n][m])) {
                if (tiles[n][m].status === "occupied") {
                    availableTiles.splice(availableTiles.indexOf(tiles[n][m]), 1)
                }
            } else {
                if (tiles[n][m].continent === "sAmerica" && tiles[n][m].status === "open" && !sAmericaClouds) {
                    availableTiles.push(tiles[n][m])
                } else if(tiles[n][m].continent === "eurasia" && tiles[n][m].status === "open" && !eurasiaClouds) {
                    availableTiles.push(tiles[n][m])
                } else if(tiles[n][m].continent === "africaMiddleEast" && tiles[n][m].status === "open" && !africaClouds) {
                    availableTiles.push(tiles[n][m])
                } else if(tiles[n][m].continent === "australia" && tiles[n][m].status === "open" && !australiaClouds) {
                    availableTiles.push(tiles[n][m])
                } else if (tiles[n][m].continent === "nAmerica" && tiles[n][m].status === "open") {
                    availableTiles.push(tiles[n][m])
                }
            }
        }
    }
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

    if (boatDrag) {
        ctx.strokeStyle = "rgb(255, 0, 0)"
        ctx.drawImage(boat, mouseX - 20, mouseY - 20, 100, 100)
        if (mouseX >= 250 && mouseX <= 500 && mouseY >= 200 && mouseY <= 400) {
            ctx.beginPath()
            ctx.moveTo(280, 250)
            ctx.lineTo(450, 250)
            ctx.stroke()
            eurasiaClouds = false
        }
    }
    requestAnimationFrame(display);
}
competitionGrowthDuration ++
function changeMoney() {
    money += 2 * numberOfRestaurants;
    amountEl.innerHTML = money;
}
setInterval(changeMoney, 100);

function taxes() {
    taxModalEl.style.display = "block"
}
setInterval(taxes, 180000)

function payTaxes() {
    taxModalEl.style.display = "none"
}

function boatPlace() {
    boatDrag = true;
}


function competitionGrowth() {
    if(availableTiles.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableTiles.length);
        availableTiles[randomIndex].competition = true;
    }
    competitionInterval = Math.round(Math.random() * 10000);
    setTimeout(competitionGrowth, competitionInterval)
}

let competitionInterval = Math.round(Math.random() * 10000)
setTimeout(competitionGrowth, competitionInterval)
