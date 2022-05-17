// Socials assignment

// Set up canvas
let cnv = document.getElementById('canvas');
let ctx = cnv.getContext('2d');
cnv.width = 1000;
cnv.height = cnv.width * 0.6;

// Variables for HTML elements
let buyBtn = document.getElementById('buy');
let restaurantImg = document.getElementById('restaurant');
let competitionImg = document.getElementById('competition')
let background = document.getElementById('background');
let cloudsImg = document.getElementById('clouds-img');
let amountEl = document.getElementById('amount');
let grid = document.getElementById('grid');
let restaurantSum = document.getElementById('restaurantAmount');
let tradeSirop = document.getElementById('sirop');
let tradeWatermelon = document.getElementById('tradeWatermelon')
let taxModalEl = document.getElementById('taxesModal');
let taxesAmt = document.getElementById('taxes');
let modalBtn = document.getElementById('hide');
let boat = document.getElementById('boat');
let buyBoatBtn = document.getElementById('buyBoat');


// Global variables
let mouseX, mouseY
let mouseDown = false
let dragRestaurant = false;
let numberOfRestaurants = 1;
let rCoordsList = [];
let money = 0;
let randomInterval = Math.floor(Math.random() * 999 + 1);
let randomX, randomY;
let randomIndex;
let repetition = 0;
let tryNextFrame = true;
let africaMiddleEast = [];
let eurasia = [];
let australia = [];
let nAmerica = [];
let sAmerica = [];
let tiles = [eurasia, australia, africaMiddleEast, sAmerica, nAmerica];
let clouds = [];
const tileSize = 20;
let africaClouds = true;
let australiaClouds = true;
let eurasiaClouds = true;
let sAmericaClouds = true;
let boatDrag = false;
let competition;
let displayLength = 1000;
let displayDuration = 0;
let trade = false;
let preventDuplicates = false;
let competitionGrowthInterval = Math.round(Math.random() * 100000);
let availableTiles = [];
let discoveredContinents = []
let africaStores, eurasiaStores, nAmericaStores, sAmericaStores, australiaStores = 0;
let profits = 0
let nAmericaTrades = [tradeSirop, tradeWatermelon]
let polution = 0
let gameOver = false;
taxModalEl.style.display = 'none';

//Tile class for placing stuff
class tile {
   constructor(x, y, size, continent) {
      this.x = x;
      this.y = y;
      this.size = size
      this.color = 'rgb(0, 0, 0)';
      this.status = 'open';
      this.index;
      this.startingStore;
      this.competition = false;
      this.continent = continent;
      this.restaurantType
      this.inside
   }

   draw() {
      if (this.startingStore) {
        this.status = 'occupied'
        this.restaurantType = restaurantImg
      } else if (this.competition) {
        this.status = "occupied"
        //This will change when Will draw
        this.restaurantType = competitionImg
      }

      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.size, this.size);
      if (
         mouseX > this.x &&
         mouseX < this.x + this.size &&
         mouseY > this.y &&
         mouseY < this.y + this.size
      ) {
         this.inside = true
      } else {
         this.inside = false
         this.color = "rgb(0, 0, 0)"
      }


      if (this.inside && dragRestaurant) {
         ctx.drawImage(restaurantImg, this.x, this.y, this.size, this.size);
         if (this.status === "open") {
            if (mouseDown) {
               numberOfRestaurants++;
               this.status = 'occupied';
               dragRestaurant = false;
               this.restaurantType = restaurantImg
            }
            this.color = "rgb(0, 255, 0)"
         } else if (this.status === "occupied") {
            this.color = "rgb(255, 0, 0)"
         }
      } else if (this.inside && boatDrag && this.continent !== "nAmerica") {
         if (mouseDown) {
            boatDrag = false
            if (this.continent === "eurasia") {
               eurasiaClouds = false
            } else if (this.continent === "africaMiddleEast") {
               africaClouds = false
            } else if (this.continent === "sAmerica") {
               sAmericaClouds = false
            } else if (this.continent === "australia") {
               australiaClouds = false
            }
         }
      }

      if (this.status === 'occupied') {
         ctx.drawImage(this.restaurantType, this.x, this.y, this.size, this.size);
      }

      if (this.inside && mouseDown && !dragRestaurant) {
         console.log("BUY")
      }
   }
}

class cloud {
   constructor(tileIndex, continent) {
      this.w = 60;
      this.continent = continent;
      this.h = this.w * 0.9;
      this.timer = 0;
      if (this.continent === 'australia') {
         this.tile = australia[tileIndex];
         this.x = this.tile.x - this.w / 2 + this.tile.size / 2;
         this.y = this.tile.y - this.h / 2 + this.tile.size / 2;
      } else if (this.continent === 'eurasia') {
         this.tile = eurasia[tileIndex];
         this.x = this.tile.x - this.w / 2 + this.tile.size / 2;
         this.y = this.tile.y - this.h / 2 + this.tile.size / 2;
      } else if (this.continent === 'africaMiddleEast') {
         this.tile = africaMiddleEast[tileIndex];
         this.x = this.tile.x - this.w / 2 + this.tile.size / 2;
         this.y = this.tile.y - this.h / 2 + this.tile.size / 2;
      } else if (this.continent === 'sAmerica') {
         this.tile = sAmerica[tileIndex];
         this.x = this.tile.x - this.w / 2 + this.tile.size / 2;
         this.y = this.tile.y - this.h / 2 + this.tile.size / 2;
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
buyBtn.addEventListener('click', drag);
document.addEventListener('mousedown', mousedownHandler);
document.addEventListener('mousemove', mousemoveHandler);
document.addEventListener('mouseup', mouseupHandler);
background.addEventListener('load', createTiles);
modalBtn.addEventListener('click', payTaxes);
buyBoatBtn.addEventListener('click', boatPlace);

//Event Functions
function drag() {
   if (money >= 50) {
      money -= 50;
      profits -= 50
      dragRestaurant = true;
   }
}

function mousedownHandler() {
   mouseDown = true
}
function mouseupHandler() {
   mouseDown = false
}

function mousemoveHandler(event) {
   mouseX = event.x - cnv.getBoundingClientRect().x;
   mouseY = event.y - cnv.getBoundingClientRect().y;
}

// Checks if a tile would have water in it and if not then creates it
function createTiles() {
   let testImageData = ctx.getImageData(0, 0, 1, 1);
   const rTest = testImageData.data[1];

   if (rTest && !preventDuplicates) {
      tryNextFrame = false;
      preventDuplicates = true;
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
               if (x >= 250 && x <= 400 && y >= 350 && y <= 550) {
                  sAmerica.push(new tile(x, y, tileSize, 'sAmerica'));
               } else if (x >= 410 && x <= 630 && y >= 258 && y <= 508) {
                  africaMiddleEast.push(new tile(x, y, tileSize, 'africaMiddleEast'));
               } else if (
                  x >= 410 &&
                  x <= 940 &&
                  y >= 20 &&
                  y <= 370 &&
                  africaMiddleEast.includes(new tile(x, y, tileSize, 'occupied')) ===
                     false
               ) {
                  eurasia.push(new tile(x, y, tileSize, 'eurasia'));
               } else if (x >= 770 && x <= 970 && y >= 400 && y <= 550) {
                  australia.push(new tile(x, y, tileSize, 'australia'));
               } else {
                  nAmerica.push(new tile(x, y, tileSize, 'nAmerica'));
               }
            }
         }
      }
      createClouds();
      let randomIndex = Math.floor(Math.random() * nAmerica.length);
      nAmerica[randomIndex].startingStore = true;
      let open = false;

      // Loops until it finds an available tile (so that it doesn't end up on startingStore)
      while (!open) {
         randomIndex = Math.floor(Math.random() * nAmerica.length);
         if (tiles[4][randomIndex].status === 'open') {
            open = true;
            nAmerica[randomIndex].competition = true;
         }
      }
   }
}

function createClouds() {
   for (let n = 0; n < eurasia.length; n++) {
      clouds.push(new cloud(n, 'eurasia'));
   }

   for (let n = 0; n < australia.length; n++) {
      clouds.push(new cloud(n, 'australia'));
   }

   for (let n = 0; n < africaMiddleEast.length; n++) {
      clouds.push(new cloud(n, 'africaMiddleEast'));
   }
   for (let n = 0; n < sAmerica.length; n++) {
      clouds.push(new cloud(n, 'sAmerica'));
   }
}

function changeMoney() {
   money += 2 * numberOfRestaurants;
   profits += 2 * numberOfRestaurants;
   amountEl.innerHTML = money;
}
setInterval(changeMoney, 100);

function taxes() {
   taxModalEl.style.display = 'block';
   profits = 0
}
setInterval(taxes, 18000);

function payTaxes() {
   taxModalEl.style.display = 'none';
}

function boatPlace() {
   if (money >= 1000) {
      money -= 1000
      boatDrag = true;
   }
}

function competitionGrowth() {
   if (availableTiles.length > 0) {
      let randomIndex = Math.floor(Math.random() * availableTiles.length);
      availableTiles[randomIndex].competition = true;
   }
   competitionInterval = Math.round(Math.random() * 10000) + 5000;
}

let competitionInterval = Math.round(Math.random() * 10000) + 5000;
setInterval(competitionGrowth, competitionInterval);

// Animation loop
requestAnimationFrame(display);

function display() {
   // Draw world map
   ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

   //Draw all the tiles
   for (let c = 0; c < tiles.length; c++) {
      for (let t = 0; t < tiles[c].length; t++) {
         tiles[c][t].draw();
      }
   }
   // Draw all the clouds
   for (let i = 0; i < clouds.length; i++) {
      clouds[i].draw();
   }
   if (!gameOver) {
      polution += 0.01
      if (polution === 175) {
         gameOver = true
      }
   }
   // Draw polution bar 
   ctx.strokeRect(35, cnv.height - 50, 175, 30)
   ctx.fillStyle = "green"
   ctx.fillRect(35.5, cnv.height -50, polution, 29.5)

   // Decide when to show a trade request
   repetition++;
   restaurantSum.innerHTML = numberOfRestaurants
   for (let c = 0; c < tiles.length; c++) {
      for (let t = 0; t < tiles[c].length; t++) {
         if (availableTiles.find((element) => element === tiles[c][t])) {
            if (tiles[c][t].status === 'occupied') {
               availableTiles.splice(availableTiles.indexOf(tiles[c][t]), 1);
            }
         } else {
            if (
               tiles[c][t].continent === 'sAmerica' &&
               tiles[c][t].status === 'open' &&
               !sAmericaClouds
            ) {
               availableTiles.push(tiles[c][t]);
            } else if (
               tiles[c][t].continent === 'eurasia' &&
               tiles[c][t].status === 'open' &&
               !eurasiaClouds
            ) {
               availableTiles.push(tiles[c][t]);
            } else if (
               tiles[c][t].continent === 'africaMiddleEast' &&
               tiles[c][t].status === 'open' &&
               !africaClouds
            ) {
               availableTiles.push(tiles[c][t]);
            } else if (
               tiles[c][t].continent === 'australia' &&
               tiles[c][t].status === 'open' &&
               !australiaClouds
            ) {
               availableTiles.push(tiles[c][t]);
            } else if (tiles[c][t].continent === 'nAmerica' && tiles[c][t].status === 'open') {
               availableTiles.push(tiles[c][t]);
            }
         }
      }
   }
   if (money >= 50) {
      buyBtn.classList.add('available');
   } else {
      buyBtn.classList.remove('available');
   }

   // Retry making the tiles if the image wasn't loaded before
   if (tryNextFrame) {
      createTiles();
   }
   if (money >= 1000) {
      buyBoatBtn.classList.add("available");
   } else {
      buyBoatBtn.classList.remove("available");
   }

   if (boatDrag) {
         ctx.drawImage(boat, mouseX - 50, mouseY - 50, 100, 100);
   }
   discover()
   trading()
   requestAnimationFrame(display);
}


function discover() {
   if (!eurasiaClouds) {
      for(let i = 0; i < clouds.length; i++) {
         if (clouds[i].continent === "eurasia") {
            clouds.splice(i, 1)
         }
      }
   } 
   
   if (!sAmericaClouds) {
      for(let i = 0; i < clouds.length; i++) {
         if (clouds[i].continent === "sAmerica") {
            clouds.splice(i, 1)
         }
      }
   } 
   
   if (!africaClouds) {
      for(let i = 0; i < clouds.length; i++) {
         if (clouds[i].continent === "africaMiddleEast") {
            clouds.splice(i, 1)
         }
      }
   } 
   
   if (!australiaClouds) {
      for(let i = 0; i < clouds.length; i++) {
         if (clouds[i].continent === "australia") {
            clouds.splice(i, 1)
         }
      }
   }
}

let trades
function trading() {
   if (repetition === randomInterval) {
      randomIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];
      randomX = randomIndex.x;
      randomY = randomIndex.y;
      trade = true;
      if (randomIndex.continent === "nAmerica") {
         trades = nAmericaTrades[Math.floor(Math.random() * nAmericaTrades.length)]
      }
   }
   if (trade) {
      if (randomIndex.continent === "nAmerica") {
         ctx.drawImage(trades, randomX, randomY - 145, 150, 150);
      } else if (randomIndex.continent === "sAmerica") {
         //ctx.drawImage(sAmericaTrades, randomX, randomY - 145, 150, 150);
      }
      ctx.strokeStyle = "green"
      displayDuration++;
      if (mouseX >= randomX + 47 && mouseX <= randomX + 47 + 40 && mouseY >= randomY - 67 && mouseY <= randomY - 67 + 20) {
         if (mouseDown) {
            trade = false;
            displayDuration = 0;
            repetition = 0;
            randomInterval = Math.floor(Math.random() * 999 + 1);

         }
      }
      if (displayDuration === displayLength) {
         trade = false;
         displayDuration = 0;
         repetition = 0;
         randomInterval = Math.floor(Math.random() * 999 + 1);
      }
   }
}
