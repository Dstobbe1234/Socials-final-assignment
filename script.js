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
let feedback = document.getElementById("feedback");
let grid = document.getElementById("grid");
let mapHeight = 1000
let mapWidth = 10000

//Event Listeners
buyBtn.addEventListener("click", drag);
//document.addEventListener("mousedown", zoom)

cnv.height = 760
cnv.width = 960
ctx.drawImage(background, 0, 0, mapWidth, mapHeight)

function drag() {
    if (money >= 50) {
        money -= 50;
        document.addEventListener("mousemove", mousemoveHandler);
        dragBool = true;
    }
}

function mousemoveHandler(event) {
    if (dragBool === true) {
        ctx.drawImage(background, 0, 0, cnv.width, cnv.height)
        mouseX = event.x - 50;
        mouseY = event.y - 50;
        ctx.drawImage(img, mouseX, mouseY, 100, 100);
        document.addEventListener("mousedown", mousedownHandler)
    }
}

function mousedownHandler() {
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
            ctx.drawImage(img, restaurantxlist[n], restaurantylist[n], 100, 100);
        }
    } if (money >= 50) {
        buyBtn.classList.add("available");
    } else {
        buyBtn.classList.remove("available");
    }
    requestAnimationFrame(display)
}

function changeMoney() {
    money += 2 * numberOfRestaurants;
    amountEl.innerHTML = money
}
setInterval(changeMoney, 500)

//function zoom(event) {
    //alert("click")
// document.addEventListener("mousemove", clickDrag)
//}

//function clickDrag(event) {
//    alert("drag")
//    let n = true
//    let mouseX = []
//    while(n === true) {
//        mouseX.push(event.x)
//        console.log(mouseX)
//        document.addEventListener("mouseUp", () => {
//            n = false;
//        })
//    }
//}
