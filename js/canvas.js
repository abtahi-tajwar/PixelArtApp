
const urlParams = new URLSearchParams(window.location.search);
const pixels = urlParams.get('pixels');
const dimensionSize = urlParams.get('dimension');


var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')
canvas.height = dimensionSize;
canvas.width = dimensionSize;
var color = document.getElementById('color')
var eraser = document.getElementById('erase')
var lineToggle = document.getElementById('line')
var submit = document.getElementById('submit')

var generatedCode = '';

const dimension = pixels
const size = dimensionSize/dimension;
const primaryColor = '#fafafa';
const secondaryColor = '#dedede';
let eraserMode = true;

let line

const artboard = new Artboard(dimensionSize, dimension, c);
artboard.initBoard();

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// function initBoard()
// {
//     for(let i = 0; i < dimension; i++) {
//         for(let j = 0; j < dimension; j++) {
//             if((i+j)%2 == 0) {
//                 board.push(new Pixel(j*size, i*size, size, primaryColor, c))
//             } else {
//                 board.push(new Pixel(j*size, i*size, size, secondaryColor, c))
//             }
            
//         }
//     }
// }
// initBoard()

let mouseState = false;

canvas.addEventListener('mousedown', () => {
    mouseState = true;
    let position = getMousePos(canvas, event);
    let x = Math.floor(position.x/size)
    let y = Math.floor(position.y/size)
    if(eraser.checked) {
        //board[x+y*dimension].erase()
        artboard.modifyPixel( x, y, {command: 'erase'} )            
    } else if(lineToggle.checked)  {
        line = new Line(x, y, artboard, dimension)        
    } else {
        // board[x+y*dimension].draw(color.value)
        artboard.modifyPixel( x, y, {command: 'draw', color: color.value })
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
            artboard.modifyPixel(x, y, { command: 'ease' });            
        } else if(lineToggle.checked)  {
            line.draw(x, y, color.value)
        } else {
            //board[x+y*dimension].draw(color.value)
            artboard.modifyPixel( x, y, {command: 'draw', color: color.value })
        }
    }
    
})

function generateCode() {
    generatedCode = `
    void drawRect(int x, int y, int size, int r, int g, int b) {
        glColor3ub(r, g, b);
        glBegin(GL_QUADS);
        glVertex2i(x, y);
        glVertex2i(x, y-size);
        glVertex2i(x+size, y-size);
        glVertex2i(x+size, y);
        glEnd();
    }
    `;

    for(var y = 0; y < dimension; y++) {
        for(var x = 0; x < dimension; x++) {
            if(artboard.isSet(x, y)) {
                //console.log(artboard[x+y*dimension].getColor())
                console.log(artboard.getColor(x, y))
                //let color = hexToRgb(board[x+y*dimension].getColor())
                let color = hexToRgb(artboard.getColor(x, y))
                console.log(color)
                generatedCode += `
    drawRect(${x*size}, ${dimensionSize-y*size}, ${size}, ${color.r}, ${color.g}, ${color.b});`
            }
            
        }
    }
}
document.querySelector('.popup button').addEventListener('click', function() {
    document.querySelector('.popup').style.display = 'none'
} )
submit.addEventListener('click', (e) => {
    e.preventDefault();
    generateCode();
    document.getElementById('popup').style.display = 'block'
    document.getElementById('codeViewer').value = generatedCode
    console.log(generatedCode);
})


