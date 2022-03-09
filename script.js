// Socials assignment
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let preventDefault
let mouseX, mouseY
let dragBool = true
let numberOfRestaurants = 0;
let restaurantxlist = []
let restaurantylist = []
let money = 50;
//Variables for HTML elements
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant");
let background = document.getElementById("background");
let amountEl = document.getElementById("amount");

//Event Listeners
buyBtn.addEventListener("click", drag, false);


ctx.fillStyle = "blue";
ctx.fillRect(0, 0, cnv.width, cnv.height);

function drag() {
    document.addEventListener("mousemove", mousemoveHandler);
    dragBool = true;
}

function mousemoveHandler(event) {
    if (dragBool === true) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        mouseX = event.x;
        mouseY = event.y;
        ctx.drawImage(img, mouseX, mouseY, 40, 40);
        document.addEventListener("mousedown", mousedownHandler)
    }
}

function mousedownHandler() {
    console.log("mousePressed");
    restaurantxlist.push(mouseX);
    restaurantylist.push(mouseY);
    numberOfRestaurants++;
    dragBool = false;
    document.removeEventListener("mousedown", mousedownHandler)

}

requestAnimationFrame(display)
function display() {
    if (numberOfRestaurants > 0) {
        for (let n = restaurantxlist.length; n >= 0; n--) {
            console.log(n)
            ctx.drawImage(img, restaurantxlist[n], restaurantylist[n], 40, 40);
        }
    }
    requestAnimationFrame(display)
}

function changeMoney() {
    money += 2 * numberOfRestaurants;
    amountEl.innerHTML = money
}
 setInterval(changeMoney, 500)