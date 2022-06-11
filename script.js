// Socials assignment

// Set up canvas
let cnv = document.getElementById('canvas');
let ctx = cnv.getContext('2d');
cnv.width = 1000;
cnv.height = 600;

// Variables for HTML elements
const buyBtn = document.getElementById('buy');
const restaurantImg = document.getElementById('restaurant');
const competitionImg = document.getElementById('competition');
const cloudsImg = document.getElementById('clouds-img');
const borderCloudsImg = document.getElementById('border-clouds-img');
const amountEl = document.getElementById('amount');
const grid = document.getElementById('grid');
const restaurantSum = document.getElementById('restaurantAmount');
const taxModalEl = document.getElementById('taxesModal');
const competitionModal = document.getElementById('competitionModal');
const taxInfo = document.getElementById('taxes');
const incomeEl = document.getElementById('income');
const modalBtn = document.getElementById('hide');
const boat = document.getElementById('boat');
const buyBoatBtn = document.getElementById('buyBoat');
const reputationEl = document.getElementById('reputation');
const cancelBtn = document.getElementById('cancel');
const buyCompetitionBtn = document.getElementById('buyCompetition');
const competitionTaxRate = document.getElementById('rate');
const storeIncome = document.getElementById('storeIncome');
const totalTaxAmtEl = document.getElementById('total');
const avocadoTrade = document.getElementById('avocadoTrade');
const sweetPotato = document.getElementById('sweetPotato');
const sweetPotatoTrade = document.getElementById('sweetPotatoTrade');
const monthlyExpensesEl = document.getElementById('monthlyExpenses');
const page = document.getElementById('page');
const salaryInfo = document.getElementById('salaryInfo');
const background = document.getElementById('background');
const tradeOptions = document.getElementById('tradeOptions');
const exploitedTradeOption = document.getElementById('exploitedTradeOption');
const fairTradeOption = document.getElementById('fairTradeOption');

function getRandInt(min, max) {
   // min and max are included
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Global variables
let mouseX, mouseY;
let mouseDown = false;
let dragRestaurant = false;
let numberOfRestaurants = 1;
let money = 0;
let randomInterval = getRandInt(500, 1000);
let randomX, randomY;
let randomIndex;
let repetition = 0;
let africaMiddleEast = [];
let asia = [];
let australia = [];
let nAmerica = [];
let sAmerica = [];
let europe = [];
let tiles = [asia, australia, africaMiddleEast, sAmerica, nAmerica, europe];
const tileSize = 20;
let boatDrag = false;
let competition;
let displayLength = 10000;
let displayDuration = 0;
let trade = false;
let availableTiles = [];
let pollution = 0;
let pollutionPercentage = 0;
let gameOver = false;
let income = 0;
let taxBool = false;
let reputation = 10;
let buyCompetitionBool = false;
let totalTaxAmt = 0;
let avocado = false;
let lemon = false;
let cloudBools = {
   sAmerica: true,
   europe: true,
   africaMiddleEast: true,
   asia: true,
   australia: true,
};
let fairTrade;

//Tile class for placing stuff
class tile {
   constructor(x, y, size, continent, id) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.id = id;
      this.color = 'rgb(0, 0, 0)';
      this.status = 'open';
      this.index;
      this.startingStore;
      this.continent = continent;
      this.restaurantType;
      this.inside;
      this.taxRate = getRandInt(5, 15);
      this.competitionClicked = false;
      this.trade = 'none';
      this.minimumWage;

      this.viewInfo = {
         bool: false,
         w: 60,
         h: 80,
      };
      // If the continent of the tile isn't north America, create a cloud
      if (continent != 'nAmerica') {
         this.clouded = true;
         this.cloud = new cloud(this);
      }
   }
   //  Draws tile
   drawOutline() {
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.size, this.size);
   }

   drawInfo() {
      if (!this.viewInfo.bool) return;

      function centerText(text, viewInfo) {
         return viewInfo.x + viewInfo.w / 2 - ctx.measureText(text).width / 2;
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 255)';
      ctx.strokeRect(this.x, this.y, this.size, this.size);
      ctx.lineWidth = 1;

      ctx.fillStyle = 'rgb(0, 0, 0, 0.5)';
      ctx.fillRect(this.viewInfo.x, this.viewInfo.y, this.viewInfo.w, this.viewInfo.h);

      ctx.fillStyle = 'rgb(230, 230, 230)';
      const titleText = 'Tile Info';
      ctx.fillText(titleText, centerText(titleText, this.viewInfo), this.viewInfo.y + 10);

      const taxText = `Tax rate: ${this.taxRate}%`;
      ctx.fillText(taxText, centerText(taxText, this.viewInfo), this.viewInfo.y + 25);

      const wageText = `MW: $${this.minimumWage}`;
      ctx.fillText(wageText, centerText(wageText, this.viewInfo), this.viewInfo.y + 35);
   }

   draw() {
      if (this.startingStore) {
         this.status = 'player';
         this.restaurantType = restaurantImg;
      } else if (this.status === 'competition') {
         this.restaurantType = competitionImg;
      }

      if (
         mouseX > this.x &&
         mouseX < this.x + this.size &&
         mouseY > this.y &&
         mouseY < this.y + this.size
      ) {
         this.inside = true;
         console.log(this.x);
         console.log(this.y);
      } else {
         this.inside = false;
         this.color = 'rgb(0, 0, 0)';
      }

      if (!this.minimumWage) {
         if (this.continent === 'nAmerica') {
            this.minimumWage = getRandInt(500, 1000);
         } else if (this.continent === 'sAmerica') {
            this.minimumWage = getRandInt(300, 700);
         } else if (this.continent === 'asia') {
            this.minimumWage = getRandInt(12, 200);
         } else if (this.continent === 'australia') {
            this.minimumWage = getRandInt(600, 1200);
         } else if (this.continent === 'europe') {
            this.minimumWage = getRandInt(300, 2110);
         } else if (this.continent === 'africa') {
            this.minimumWage = getRandInt(12, 200);
         }
      }

      if (this.inside && dragRestaurant && !this.clouded) {
         ctx.drawImage(restaurantImg, this.x, this.y, this.size, this.size);
         if (this.status !== 'player' && this.status !== 'competition') {
            if (mouseDown) {
               numberOfRestaurants++;
               this.status = 'player';
               dragRestaurant = false;
               this.restaurantType = restaurantImg;
               reputation += 10;
            }
            this.color = 'rgb(0, 255, 0)';
         } else {
            this.color = 'rgb(255, 0, 0)';
         }
      } else if (this.inside && boatDrag && this.continent !== 'nAmerica') {
         if (mouseDown) {
            boatDrag = false;
            this.clouded = false;
            cloudBools[this.continent] = false;
         }
      }

      if (this.id === 289 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('avocadoTrade');
         } else {
            avocado = true;
         }
      } else if (this.id === 249 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('citronTrade');
         } else {
            lemon = true;
         }
      }

      if (this.inside && this.status === 'open' && !this.clouded && mouseDown) {
         this.viewInfo.bool = true;
         this.viewInfo.x = mouseX - this.viewInfo.w < 0 ? mouseX : mouseX - this.viewInfo.w;
         this.viewInfo.y = mouseY < this.viewInfo.h ? mouseY : mouseY - this.viewInfo.h;
      } else if (mouseDown) {
         this.viewInfo.bool = false;
      }

      if (this.status === 'player' || this.status === 'competition') {
         ctx.drawImage(this.restaurantType, this.x, this.y, this.size, this.size);
      }

      if (
         this.inside &&
         mouseDown &&
         !dragRestaurant &&
         this.status === 'competition' &&
         taxBool === false
      ) {
         this.competitionClicked = true;
         competitionTaxRate.innerHTML = this.taxRate;
         competitionModal.style.display = 'block';
      }

      if (this.competitionClicked && buyCompetitionBool === true) {
         this.status = 'player';
         numberOfRestaurants++;
         this.restaurantType = restaurantImg;
         buyCompetitionBool = false;
         this.competitionClicked = false;
      }

      // Draw tile's cloud
      if (!cloudBools[this.continent]) {
         this.clouded = false;
      } else {
         this.cloud.draw();
      }
   }
}

function cancel() {
   competitionModal.style.display = 'none';
}

function buyCompetition() {
   if (money >= 100 && buyCompetitionBool === false) {
      money -= 100;
      reputation += 20;
      buyCompetitionBool = true;
      competitionModal.style.display = 'none';
   }
}

class cloud {
   constructor(tile) {
      this.w = 60;
      this.h = this.w * 0.9;
      this.timer = 0;
      this.imageX = 0;
      this.imageY = 0;
      this.imageW = 165;
      this.imageH = 135;
      this.tileId = tile.id;

      this.x = tile.x - this.w / 2 + tile.size / 2;
      this.y = tile.y - this.h / 2 + tile.size / 2;

      const borderTilesB = [160, 161, 162, 163, 164];

      const borderTilesR = [26, 41, 69, 97, 120, 141, 159, 164];

      this.borderTile = {
         bool: false,
         sides: [],
      };

      if (borderTilesB.includes(this.tileId)) {
         this.borderTile.bool = true;
         this.borderTile.sides.push('bottom');
      }
      if (borderTilesR.includes(this.tileId)) {
         this.borderTile.bool = true;
         this.borderTile.sides.push('right');
      }
   }

   draw() {
      this.timer++;
      if (this.timer === 10) {
         this.timer = 0;
         if (getRandInt(0, 3) === 0) {
            this.imageX = getRandInt(0, 3);
            this.imageY = getRandInt(0, 2);
         }
      }

      ctx.drawImage(
         cloudsImg,
         this.imageX * this.imageW,
         this.imageY * this.imageH,
         this.imageW,
         this.imageH,
         this.x,
         this.y,

         this.borderTile.sides.includes('right') && !cloudBools.asia ? this.w - 15 : this.w,
         this.borderTile.sides.includes('bottom') && !cloudBools.asia ? this.h - 15 : this.h
      );
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
cancelBtn.addEventListener('click', cancel);
buyCompetitionBtn.addEventListener('click', buyCompetition);
fairTradeOption.addEventListener('click', () => {
   fairTrade = true;
   chooseTradeOption()
})
exploitedTradeOption.addEventListener('click', () => {
   fairTrade = false;
   chooseTradeOption()
})

//Event Functions
function drag() {
   if (money >= 50 && !dragRestaurant && !boatDrag) {
      money -= 50;
      income -= 50;
      dragRestaurant = true;
   }
}

function mousedownHandler() {
   mouseDown = true;
}
function mouseupHandler() {
   mouseDown = false;
}

function mousemoveHandler(event) {
   mouseX = event.x - cnv.getBoundingClientRect().x;
   mouseY = event.y - cnv.getBoundingClientRect().y;
}
let tileIdentifier = 0;

// Checks if a tile would have water in it and if not then creates it
function createTiles() {
   ctx.fillStyle = 'rgb(55, 83, 218)';
   ctx.fillRect(0, 0, cnv.width, cnv.height);
   ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

   for (let y = 0; y < cnv.height; y += 20, x = 0) {
      for (let x = 0; x < cnv.width; x += 20) {
         let imageData = ctx.getImageData(x, y, 20, 20);
         let containsOcean = false;
         let r, g, b;

         for (let i = 0; i + 3 < imageData.data.length; i += 4) {
            r = imageData.data[i];
            g = imageData.data[i + 1];
            b = imageData.data[i + 2];

            if (r === 55 && g === 83 && b === 218) {
               containsOcean = true;
            }
         }
         if (!containsOcean) {
            tileIdentifier++;
            if (x >= 250 && x <= 400 && y >= 350 && y <= 550) {
               sAmerica.push(new tile(x, y, tileSize, 'sAmerica', tileIdentifier));
            } else if (
               x >= 410 &&
               x <= 590 &&
               y >= 258 &&
               y <= 508 &&
               tileIdentifier !== 217 &&
               tileIdentifier !== 231 &&
               tileIdentifier !== 247
            ) {
               africaMiddleEast.push(new tile(x, y, tileSize, 'africaMiddleEast', tileIdentifier));
            } else if (x >= 770 && x <= 970 && y >= 400 && y <= 550) {
               australia.push(new tile(x, y, tileSize, 'australia', tileIdentifier));
            } else if (
               (x >= 480 && x <= 660 && y >= 80 && y <= 200) ||
               (x >= 280 && x <= 380 && y >= 0 && y <= 100)
            ) {
               europe.push(new tile(x, y, tileSize, 'europe', tileIdentifier));
            } else if (
               x >= 410 &&
               x <= 940 &&
               y >= 20 &&
               y <= 370
               //africaMiddleEast.includes(new tile(x, y, tileSize, 'africaMiddleEast')) === false
            ) {
               asia.push(new tile(x, y, tileSize, 'asia', tileIdentifier));
            } else {
               nAmerica.push(new tile(x, y, tileSize, 'nAmerica', tileIdentifier));
            }
         }
      }
   }

   let randomIndex = getRandInt(0, nAmerica.length - 1);
   nAmerica[randomIndex].startingStore = true;
   let open = false;

   // Loops until it finds an available tile on the map (so that it doesn't end up on startingStore)
   while (!open) {
      randomIndex = getRandInt(0, nAmerica.length - 1);
      if (tiles[4][randomIndex].status === 'open') {
         open = true;
         nAmerica[randomIndex].status = 'competition';
      }
   }

   display();
}

function changeMoney() {
   if (!taxBool) {
      money += 2 * numberOfRestaurants;
      income += 2 * numberOfRestaurants;
   }
   amountEl.innerHTML = money;
}
setInterval(changeMoney, 100);
let storeNum = 0;
function taxes() {
   if (income >= 0) {
      taxBool = true;
      for (let i = 0; i < tiles.length; i++) {
         for (let n = 0; n < tiles[i].length; n++) {
            if (tiles[i][n].status === 'player') {
               storeNum++;
               totalTaxAmt += Math.round(
                  (income / numberOfRestaurants) * (tiles[i][n].taxRate / 100)
               );
               incomeEl.innerHTML = income;
               storeIncome.innerHTML = Math.round(income / numberOfRestaurants);
               taxInfo.innerHTML +=
                  '<br> Store #' + storeNum + '<br>Income tax rate: ' + tiles[i][n].taxRate;
               totalTaxAmtEl.innerHTML = totalTaxAmt;
            }
         }
      }
      taxModalEl.style.display = 'block';
   } else {
      setTimeout(taxes, 18000);
   }
}
setTimeout(taxes, 18000);

function payTaxes() {
   taxBool = false;
   taxModalEl.style.display = 'none';
   taxInfo.innerHTML = '';
   money -= totalTaxAmt;
   totalTaxAmt = 0;
   storeNum = 0;
   income = 0;
   setTimeout(taxes, 18000);
}

function monthlyExpenses() {
   let totalSalaryCosts = 0;
   monthlyExpensesEl.style.display = 'block';
   mergedTiles = tiles.flat(1);
   for (let x = 0; x < mergedTiles.length; x++) {
      if (mergedTiles[x].status === 'player') {
         totalSalaryCosts += mergedTiles[x].minimumWage * 5;
      }
   }
   salaryInfo.innerHTML = totalSalaryCosts;
}
setTimeout(monthlyExpenses, 4500);

function boatPlace() {
   if (money >= 1000) {
      money -= 1000;
      income -= 1000;
      boatDrag = true;
   }
}

function competitionGrowth() {
   if (availableTiles.length > 0) {
      let randomIndex = getRandInt(0, availableTiles.length - 1);
      availableTiles[randomIndex].status = 'competition';
   }
   competitionInterval = getRandInt(5000, 15000);
}

let competitionInterval = getRandInt(5000, 15000);
setInterval(competitionGrowth, competitionInterval);

// Animation loop
function display() {
   // Draw world map
   const colorPercentage = 1 - pollutionPercentage;

   ctx.fillStyle = `rgb(${55 * colorPercentage}, ${83 * colorPercentage}, ${
      218 * colorPercentage
   })`;

   page.style.backgroundColor = `rgb(${55 * colorPercentage}, ${83 * colorPercentage}, ${
      218 * colorPercentage
   })`;

   ctx.fillRect(0, 0, cnv.width, cnv.height);
   ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

   // Draw all the tiles
   for (let c = 0; c < tiles.length; c++) {
      for (let t = 0; t < tiles[c].length; t++) {
         tiles[c][t].drawOutline();
      }
      for (let t = 0; t < tiles[c].length; t++) {
         tiles[c][t].draw();
      }
   }

   for (let c = 0; c < tiles.length; c++) {
      for (let t = 0; t < tiles[c].length; t++) {
         tiles[c][t].drawInfo();
      }
   }

   if (!gameOver) {
      pollution += 0.5;
      pollutionPercentage = pollution / 1000;

      if (pollutionPercentage === 1) {
         gameOver = true;
      }
   }

   if (avocado) {
      document.getElementById('avocado').src = 'img/Avocat.png';
   }

   if (lemon) {
      document.getElementById('citron').src = 'img/Citron.png';
   }

   // Draw pollution bar
   ctx.strokeStyle = 'rgb(255, 255, 255)';
   ctx.strokeRect(35, cnv.height - 50, 175, 30);
   ctx.fillStyle = 'green';
   ctx.fillRect(35.5, cnv.height - 50, pollutionPercentage * 175, 29.5);

   // Decide when to show a trade request
   restaurantSum.innerHTML = numberOfRestaurants;
   for (let c = 0; c < tiles.length; c++) {
      for (let t = 0; t < tiles[c].length; t++) {
         if (availableTiles.find((element) => element === tiles[c][t])) {
            if (tiles[c][t].status === 'player' || tiles[c][t].status === 'competition') {
               availableTiles.splice(availableTiles.indexOf(tiles[c][t]), 1);
            }
         } else {
            if (tiles[c][t].clouded === false && tiles[c][t].status === 'open') {
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

   if (money >= 1000) {
      buyBoatBtn.classList.add('available');
   } else {
      buyBoatBtn.classList.remove('available');
   }

   if (boatDrag) {
      ctx.drawImage(boat, mouseX - 50, mouseY - 50, 100, 100);
   }
   reputationEl.innerHTML = reputation;
   trading();

   requestAnimationFrame(display);
}

let mergedTiles = [];
let possibleTrades = [];
let chosenTrade;
function trading() {
   repetition++;

   if (repetition === randomInterval) {
      mergedTiles = tiles.flat(1);
      possibleTrades = mergedTiles.filter((tile) => tile.trade !== 'none');
      chosenTrade = possibleTrades[getRandInt(0, possibleTrades.length - 1)];
      if (typeof chosenTrade !== 'undefined' && chosenTrade.trade !== 'done') {
         trade = true;
      } else {
         randomInterval = getRandInt(500, 1000);
         repetition = 0;
      }
   }
   if (trade) {
      displayDuration++;
      ctx.drawImage(chosenTrade.trade, chosenTrade.x, chosenTrade.y - 150, 150, 150);
      if (
         mouseX > chosenTrade.x + 47 &&
         mouseX < chosenTrade.x + 86 &&
         mouseY > chosenTrade.y - 69 &&
         mouseY < chosenTrade.y - 55
      ) {
         document.body.style.cursor = 'pointer';
         if (mouseDown) {
            document.body.style.cursor = 'default';
            tradeOptions.style.display = 'block'
         }
      } else {
         document.body.style.cursor = 'default';
      }
      if (displayDuration === displayLength) {
         trade = false;
         displayDuration = 0;
         repetition = 0;
         randomInterval = getRandInt(500, 1000);
      }
   }
}


function chooseTradeOption() {
   if(fairTrade) {

   } else {

   }
   trade = false;
   chosenTrade.trade = 'done';
   displayDuration = 0;
   repetition = 0;
   randomInterval = getRandInt(500, 1000);
   tradeOptions.style.display = 'none';
}