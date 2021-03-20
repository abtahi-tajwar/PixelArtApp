//Retreiving values from main page settings
const urlParams = new URLSearchParams(window.location.search);
const pixels = urlParams.get('pixels');
const dimensionSize = urlParams.get('dimension');
const sheetSizeX = urlParams.get('sheetSizeX');
const sheetSizeY = urlParams.get('sheetSizeY');

//Retreiving canvas from main page
var canvas = document.getElementById('currentCanvas')
var c = canvas.getContext('2d')
var prevCanvas = document.getElementById('prevCanvas')
var pc = prevCanvas.getContext('2d')

//Canvas settings
canvas.height = dimensionSize;
canvas.width = dimensionSize;

//Getting drawing tool states
var color = document.getElementById('color')
var eraser = document.getElementById('erase')
var lineToggle = document.getElementById('line')

//Getting selected page state
var sheetX = document.getElementById('sheetX').value - 1;
var sheetY = document.getElementById('sheetY').value - 1;
var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var goButton = document.getElementById('go')

//Starting config
const dimension = pixels
const size = dimensionSize/dimension;

//Accessing opacity information of artboard
const opacitySlider = document.getElementById('opacitySlider');
const opacityText = document.getElementById('opacityText');
let opacity = document.getElementById('opacityText').value;

//Initializing sheets
const sheets = [];
const prevSheets = [];
for(let i = 0; i < sheetSizeX; i++) {
    sheets[i] = new Array();
    for(let j = 0; j < sheetSizeY; j++) {
        sheets[i].push(new Artboard(dimensionSize, pixels, c))
    }
}
for(let i = 0; i < sheetSizeX; i++) {
    prevSheets[i] = new Array();
    for(let j = 0; j < sheetSizeY; j++) {
        prevSheets[i].push(new Artboard(dimensionSize, pixels, pc))
    }
}
let currentSheet = sheets[sheetY][sheetX];
let prevSheet = prevSheets[sheetY][sheetX];
currentSheet.initBoard();


////////////// Drawing Logic /////////////////
let mouseState = false;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
canvas.addEventListener('mousedown', () => {
    mouseState = true;
    let position = getMousePos(canvas, event);
    let x = Math.floor(position.x/size)
    let y = Math.floor(position.y/size)
    if(eraser.checked) {
        //board[x+y*dimension].erase()
        currentSheet.modifyPixel( x, y, {command: 'erase'} )
        prevSheets[sheetY][sheetX].savePixelInfo( x, y, {command: 'erase'} )     
    } else if(lineToggle.checked)  {
        line = new Line(x, y, currentSheet, dimension)        
    } else {
        // board[x+y*dimension].draw(color.value)
        currentSheet.modifyPixel( x, y, {command: 'draw', color: color.value })
        prevSheets[sheetY][sheetX].savePixelInfo( x, y, {command: 'draw', color: color.value })
    }
})
canvas.addEventListener('mouseup', () => {
    mouseState = false;
})
canvas.addEventListener('mousemove', function(event) {
    if(mouseState) {
        let position = getMousePos(canvas, event);
        let x = Math.floor(position.x/size)
        let y = Math.floor(position.y/size)
        if(eraser.checked) {
            //board[x+y*dimension].erase()
            currentSheet.modifyPixel(x, y, { command: 'ease' });
            prevSheets[sheetY][sheetX].savePixelInfo( x, y, {command: 'erase'} )            
        } else if(lineToggle.checked)  {
            line.draw(x, y, color.value)
        } else {
            //board[x+y*dimension].draw(color.value)
            currentSheet.modifyPixel( x, y, {command: 'draw', color: color.value })
            prevSheets[sheetY][sheetX].savePixelInfo( x, y, {command: 'draw', color: color.value })
        }
    }
    
})
////////// Drawing Logic End /////////////////

// Artboard change logic
function loadBoard(x, y) {
    //console.log(sheetSizeX);
    currentSheet = sheets[y][x]
    if(x == 0 && y == 0) {
        prevSheet = prevSheets[y][x]
    }    
    else if(x == 0) {
        prevSheet = prevSheets[y-1][sheetSizeX - 1]
    } else {
        prevSheet = prevSheets[y][x-1]
    }
    currentSheet.drawBoard();
    prevSheet.drawBoard();
}
goButton.addEventListener('click', (e) => {
    e.preventDefault();
    //console.log(sheetX)
    //loadBoard(document.getElementById('sheetX').value - 1, document.getElementById('sheetY').value - 1);
    loadBoard(sheetX, sheetY);
})
nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    if(sheetX >= sheetSizeX-1 && sheetY != sheetSizeY-1) {
        sheetX = 0;
        sheetY = sheetY + 1;
        document.getElementById('sheetX').value = sheetX + 1;
        document.getElementById('sheetY').value = sheetY + 1;
        loadBoard(sheetX, sheetY)
        
    } else if(sheetY < sheetSizeY && sheetX < sheetSizeX-1) {
        sheetX = sheetX + 1;
        sheetY = sheetY;
        document.getElementById('sheetX').value = sheetX + 1;
        document.getElementById('sheetY').value = sheetY + 1;
        loadBoard(sheetX, sheetY)
    }

})
prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    if(sheetX <= 0 && sheetY != 0) {
        sheetX = sheetSizeX - 1;
        sheetY = sheetY - 1;
        document.getElementById('sheetX').value = sheetX + 1;
        document.getElementById('sheetY').value = sheetY + 1;
        loadBoard(sheetX, sheetY)
        
    } else if(sheetY >= 0 && sheetX > 0) {
        sheetX = sheetX - 1;
        sheetY = sheetY;
        document.getElementById('sheetX').value = sheetX + 1;
        document.getElementById('sheetY').value = sheetY + 1;
        loadBoard(sheetX, sheetY)
    }

})
//Manage opacity of artbaord
canvas.style.opacity = 1;
prevCanvas.style.opacity = 1;
opacitySlider.addEventListener('change', () => {
    opacityText.value = opacitySlider.value;
    canvas.style.opacity = opacitySlider.value/100;
})
opacityText.addEventListener('change', () => {
    opacitySlider.value = opacityText.value;
    canvas.style.opacity = opacitySlider.value/100;
})
//Update sheets value
document.getElementById('sheetX').addEventListener('change', () => {
    sheetX = document.getElementById('sheetX').value - 1;
})
document.getElementById('sheetY').addEventListener('change', () => {
    sheetY = document.getElementById('sheetY').value - 1;
})

//Copy from last sheet
document.getElementById('copy').addEventListener('click', (e) => {
    e.preventDefault()
    currentSheet.copyBoard(prevSheet);
    prevSheets[sheetY][sheetX].copyBoard(prevSheet);
})