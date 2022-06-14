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
// const sweetPotato = document.getElementById('sweetPotato');
// const sweetPotatoTrade = document.getElementById('sweetPotatoTrade');
const monthlyExpensesEl = document.getElementById('monthlyExpenses');
const page = document.getElementById('page');
const salaryInfo = document.getElementById('salaryInfo');
const background = document.getElementById('background');
const tradeOptions = document.getElementById('tradeOptions');
const exploitedTradeOption = document.getElementById('exploitedTradeOption');
const fairTradeOption = document.getElementById('fairTradeOption');
const tradeInfo = document.getElementById('tradeInfo');
const payMEBtn = document.getElementById('payMonthlyExpenses');
const evadeBtn = document.getElementById('evade');
const monthlyExpensesTot = document.getElementById('monthlyExpensesTot');

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
let randomInterval = getRandInt(50, 1000);
let randomX, randomY;
let randomIndex;
let repetition = 0;
let africa = [];
let asia = [];
let australia = [];
let nAmerica = [];
let sAmerica = [];
let europe = [];
let tiles = [asia, australia, africa, sAmerica, nAmerica, europe];
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
let modalBool = false;
let reputation = 10;
let buyCompetitionBool = false;
let totalTaxAmt = 0;
let avocado = false;
let lemon = false;
let orange = false;
let quandong = false;
let watermelon = false;
let apple = false;
let sweetPotato = false;
let cloudBools = {
   sAmerica: true,
   europe: true,
   africa: true,
   asia: true,
   australia: true,
};
let fairTrade;
let monthlyTradeCosts = 0;
let totalSalaryCosts;
let cloudImages = {};
const monthlyInterval = 85000;
let monthlyCount = 0;

//Event Listeners
buyBtn.addEventListener('click', drag);
document.addEventListener('mousedown', mousedownHandler);
document.addEventListener('mousemove', mousemoveHandler);
document.addEventListener('mouseup', mouseupHandler);
modalBtn.addEventListener('click', payTaxes);
buyBoatBtn.addEventListener('click', boatPlace);
cancelBtn.addEventListener('click', cancel);
buyCompetitionBtn.addEventListener('click', buyCompetition);
fairTradeOption.addEventListener('click', () => {
   fairTrade = true;
   chooseTradeOption();
});
exploitedTradeOption.addEventListener('click', () => {
   fairTrade = false;
   chooseTradeOption();
});
payMEBtn.addEventListener('click', payMonthlyExpenses);
evadeBtn.addEventListener('click', evadeTaxes);
cloudsImg.addEventListener('load', () => {
   let colors = [
      { continent: 'sAmerica', color: 'lightgreen', intensity: 0.5 },
      { continent: 'europe', color: 'blue', intensity: 0.3 },
      { continent: 'asia', color: 'red', intensity: 0.3 },
      { continent: 'australia', color: 'purple', intensity: 0.5 },
      { continent: 'africa', color: 'yellow', intensity: 0.5 },
   ];

   for (let c = 0; c < colors.length; c++) {
      ctx.drawImage(cloudsImg, 0, 0);

      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = colors[c].intensity;

      ctx.fillStyle = colors[c].color;
      ctx.fillRect(0, 0, cnv.width, cnv.height);

      let image = new Image();
      image.src = cnv.toDataURL();

      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      cloudImages[colors[c].continent] = image;
   }

   if (!background.complete) {
      background.onload = createTiles();
   } else {
      createTiles();
   }
});

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
         this.cloud = new cloud(this.continent, this.x, this.y, this.size, this.id);
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
      } else {
         this.inside = false;
         this.color = 'rgb(0, 0, 0)';
      }

      if (!this.minimumWage) {
         if (this.continent === 'nAmerica') {
            this.minimumWage = getRandInt(1800, 3500);
         } else if (this.continent === 'sAmerica') {
            this.minimumWage = getRandInt(7, 600);
         } else if (this.continent === 'asia') {
            this.minimumWage = getRandInt(6, 550);
         } else if (this.continent === 'australia') {
            this.minimumWage = getRandInt(1800, 3500);
         } else if (this.continent === 'europe') {
            this.minimumWage = getRandInt(1000, 3000);
         } else if (this.continent === 'africa') {
            this.minimumWage = getRandInt(7, 550);
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

      if (this.id === 265 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('avocadoTrade');
         } else {
            avocado = true;
         }
      } else if (this.id === 215 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('citronTrade');
         } else {
            lemon = true;
         }
      } else if (this.id === 191 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('orangeTrade');
         } else {
            orange = true;
         }
      } else if (this.id === 244 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('watermelonTrade');
         } else {
            watermelon = true;
         }
      } else if (this.id === 281 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('quandongTrade');
         } else {
            quandong = true;
         }
      } else if (this.id === 117 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('appleTrade');
         } else {
            apple = true;
         }
      } else if (this.id === 252 && !this.clouded) {
         if (this.trade !== 'done') {
            this.trade = document.getElementById('sweetPotatoTrade');
         } else {
            sweetPotato = true;
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
         modalBool === false
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
   constructor(continent, tileX, tileY, tileSize, tileId) {
      this.w = 60;
      this.h = this.w * 0.9;
      this.timer = 0;
      this.imageX = 0;
      this.imageY = 0;
      this.imageW = 165;
      this.imageH = 135;
      this.changeX = 0;
      this.changeY = 0;
      this.changeW = 0;
      this.changeH = 0;
      this.continent = continent;
      this.x = tileX - this.w / 2 + tileSize / 2;
      this.y = tileY - this.h / 2 + tileSize / 2;
      this.tileId = tileId;
   }

   draw() {
      const borderTilesT = [197, 182, 141];
      const borderTilesB = [181, 163, 120, 162, 44];
      const borderTilesL = [198, 183, 182, 164, 141, 142, 121, 99, 72];
      const borderTilesR = [181, 163, 140, 120, 119, 98, 71];

      this.timer++;
      if (this.timer === 10) {
         this.timer = 0;
         if (getRandInt(0, 3) === 0) {
            this.imageX = getRandInt(0, 3);
            this.imageY = getRandInt(0, 2);
         }
      }

      if (
         (!cloudBools.europe && this.continent === 'asia') ||
         (!cloudBools.asia && this.continent === 'europe')
      ) {
         if (borderTilesT.includes(this.tileId)) {
            this.changeY = 10;
            this.changeH = 10;
         } else if (borderTilesB.includes(this.tileId)) {
            this.changeH = 15;
         }

         if (borderTilesL.includes(this.tileId)) {
            this.changeX = 15;
            this.changeW = 15;
         } else if (borderTilesR.includes(this.tileId)) {
            this.changeW = 15;
         }
      }

      ctx.drawImage(
         cloudImages[this.continent],
         this.imageX * this.imageW,
         this.imageY * this.imageH,
         this.imageW,
         this.imageH,
         this.x + this.changeX,
         this.y + this.changeY,
         this.w - this.changeW,
         this.h - this.changeH
      );
   }
}

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
   // console.log(mouseX, mouseY);
}
let tileId = 0;

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
            tileId++;

            if (x >= 250 && x <= 400 && y >= 350 && y <= 550) {
               sAmerica.push(new tile(x, y, tileSize, 'sAmerica', tileId));
            } else if (x >= 430 && x <= 575 && y >= 310 && y <= 510) {
               africa.push(new tile(x, y, tileSize, 'africa', tileId));
            } else if (x >= 770 && x <= 970 && y >= 400 && y <= 550) {
               australia.push(new tile(x, y, tileSize, 'australia', tileId));
            } else if (
               (x >= 480 && x < 620 && y >= 130 && y < 280) ||
               (x >= 620 && x < 660 && y >= 160 && y < 220) ||
               (x >= 280 && x < 400 && y >= 0 && y < 200) ||
               tileId === 163 ||
               tileId === 140
            ) {
               europe.push(new tile(x, y, tileSize, 'europe', tileId));
            } else if (
               x >= 580 &&
               x <= 970 &&
               y >= 80 &&
               y <= 370
               //africa.includes(new tile(x, y, tileSize, 'africa')) === false
            ) {
               asia.push(new tile(x, y, tileSize, 'asia', tileId));
            } else {
               nAmerica.push(new tile(x, y, tileSize, 'nAmerica', tileId));
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
   reputation;

   display();
}

function toStat(value) {
   const valueAbs = Math.abs(value);
   const sign = Math.sign(value);

   if (valueAbs >= 1e18) {
      return ((valueAbs / 1e18) * sign).toFixed(1) + '?';
   } else if (valueAbs >= 1e15) {
      return ((valueAbs / 1e15) * sign).toFixed(1) + 'q';
   } else if (valueAbs >= 1e12) {
      return ((valueAbs / 1e12) * sign).toFixed(1) + 't';
   } else if (valueAbs >= 1e9) {
      return ((valueAbs / 1e9) * sign).toFixed(1) + 'b';
   } else if (valueAbs >= 1e6) {
      return ((valueAbs / 1e6) * sign).toFixed(1) + 'm';
   } else if (valueAbs >= 1e3) {
      return ((valueAbs / 1e3) * sign).toFixed(1) + 'k';
   } else {
      return valueAbs * sign;
   }
}

function changeMoney() {
   if (!modalBool) {
      money += 100 * reputation;
      income += 100 * reputation;
   }
   amountEl.innerHTML = toStat(money);
}
setInterval(changeMoney, 100);

function monthlyExpenses() {
   let stores = 0;

   monthlyCount++;
   modalBool = true;
   totalSalaryCosts = 0;
   monthlyExpensesEl.style.display = 'block';
   mergedTiles = tiles.flat(1);
   for (let x = 0; x < mergedTiles.length; x++) {
      if (mergedTiles[x].status === 'player') {
         stores++;
         salaryInfo.innerHTML += `<br>Store # ${stores} <br>Continent: ${mergedTiles[x].continent}<br>Monthly Salary per employee: ${mergedTiles[x].minimumWage}$ (*5)`;
         totalSalaryCosts += mergedTiles[x].minimumWage * 5;
      }
   }
   if (monthlyTradeCosts !== 0) {
      tradeInfo.innerHTML = monthlyTradeCosts;
   }
   monthlyExpensesTot.innerHTML = monthlyTradeCosts + totalSalaryCosts;
}
setTimeout(monthlyExpenses, monthlyInterval);

function payMonthlyExpenses() {
   modalBool = false;
   money -= monthlyTradeCosts + totalSalaryCosts;
   monthlyExpensesEl.style.display = 'none';
   if (money < 0) {
      console.log('bankrupt');
   }

   if (monthlyCount >= 4) {
      setTimeout(taxes, 200);
   } else {
      setTimeout(monthlyExpenses, monthlyInterval);
   }
}

function taxes() {
   let storeNum = 0;

   if (income >= 0) {
      modalBool = true;
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
   }
}

function payTaxes() {
   modalBool = false;
   taxModalEl.style.display = 'none';
   taxInfo.innerHTML = '';
   money -= totalTaxAmt;
   totalTaxAmt = 0;
   income = 0;

   setTimeout(monthlyExpenses, monthlyInterval);
}

function evadeTaxes() {
   if (reputation >= 20) {
      modalBool = false;
      taxModalEl.style.display = 'none';
      taxInfo.innerHTML = '';
      totalTaxAmt = 0;
      income = 0;
   }

   setTimeout(monthlyExpenses, monthlyInterval);
}

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
      pollutionPercentage = pollution / 20000;

      if (pollutionPercentage === 1) {
         gameOver = true;
      }
   }

   if (avocado) {
      document.getElementById('avocado').src = 'img/Avocat.png';
   }

   if (lemon) {
      document.getElementById('lemon').src = 'img/Citron.png';
   }

   if (orange) {
      document.getElementById('orange').src = 'img/orange.png';
   }

   if (watermelon) {
      document.getElementById('watermelon').src = 'img/watermelon.png';
   }

   if (quandong) {
      document.getElementById('quandong').src = 'img/Quandong.png';
   }

   if (apple) {
      document.getElementById('apple').src = 'img/Apple.png';
   }

   if (sweetPotato) {
      document.getElementById('sweetPotato').src = 'img/Sweet Potato.png';
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
      possibleTrades = mergedTiles.filter((tile) => tile.trade !== 'none' && tile.trade !== 'done');
      chosenTrade = possibleTrades[getRandInt(0, possibleTrades.length - 1)];

      if (chosenTrade && chosenTrade.trade !== 'done') {
         trade = true;
      } else {
         randomInterval = getRandInt(50, 1000);
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
            tradeOptions.style.display = 'block';
         }
      } else {
         document.body.style.cursor = 'default';
      }
      if (displayDuration === displayLength) {
         trade = false;
         displayDuration = 0;
         repetition = 0;
         randomInterval = getRandInt(50, 1000);
      }
   }
}

function chooseTradeOption() {
   if (fairTrade) {
      monthlyTradeCosts += 100;
      reputation += 40;
   } else {
      monthlyTradeCosts += 25;
      reputation += 10;
   }
   trade = false;
   chosenTrade.trade = 'done';
   displayDuration = 0;
   repetition = 0;
   randomInterval = getRandInt(50, 1000);
   tradeOptions.style.display = 'none';
}
