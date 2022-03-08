// Socials assignment
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let mouseX, mouseY
let dragBool = false
//Variables for HTML elements
let buyBtn = document.getElementById("buy");
let img = document.getElementById("restaurant")
//Event Listeners

buyBtn.addEventListener("click", drag);
ctx.drawImage(img, 10, 10, 5, 5);
function drag() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.width, ctx.heigth);
    document.addEventListener("mousemove", mousemoveHandler);
    mousemoveHandler()
    }

function mousemoveHandler(event) {
    console.log(event)
    let cnvRect = cnv.getBoundingClientRect()
//    mouseX = event.clientX - cnvRect;
//    mouseY = event.clientY - cnvRect;
//    ctx.drawImage(img, mouseX, mouseY, 20, 20);
}

function mousedownHandler(event) {
    alert("mousePressed")
    dragBool = false;
}

