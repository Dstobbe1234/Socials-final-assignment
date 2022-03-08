// Socials assignment
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let mouseX, mouseY
let dragBool = true
//Variables for HTML elements
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant")
//Event Listeners

buyBtn.addEventListener("click", drag);
ctx.drawImage(img, 10, 10, 5, 5);
function drag() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.width, ctx.heigth);
    if (dragBool === true) {
        requestAnimationFrame(drag)
        document.addEventListener("mousemove", mousemoveHandler);
    }
}

function mousemoveHandler(event) {
    let cnvRect = cnv.getBoundingClientRect()
    mouseX = event.clientX - cnvRect.left;
    mouseY = event.clientY;
    console.log(mouseX)
    ctx.drawImage(img, mouseX, mouseY, 20, 20);
    document.addEventListener("mousedown", mousedownHandler);
}

function mousedownHandler(event) {
    alert("mousePressed")
    dragBool = false;
}

