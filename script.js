// Socials assignment
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let mouseX, mouseY
let dragBool = true
//Variables for HTML elements
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant");
let background = document.getElementById("background");
//Event Listeners
buyBtn.addEventListener("click", drag);

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
        document.addEventListener("mousedown", mousedownHandler);
    }
}

function mousedownHandler(event) {
    console.log("mousePressed")
    dragBool = false;
}
