
const urlParams = new URLSearchParams(window.location.search);
const pixels = urlParams.get('pixels');
const dimensionSize = urlParams.get('dimension');


var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')
canvas.height = dimensionSize;
canvas.width = dimensionSize;
var color = document.getElementById('color')
var eraser = document.getElementById('erase')
var submit = document.getElementById('submit')
console.log(submit)

var generatedCode = `
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

let board = []
const dimension = pixels
const size = dimensionSize/dimension;
const primaryColor = '#fafafa';
const secondaryColor = '#dedede';
let eraserMode = true;

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

for(let i = 0; i < dimension; i++) {
    for(let j = 0; j < dimension; j++) {
        if((i+j)%2 == 0) {
            board.push(new Pixel(j*size, i*size, size, primaryColor, c))
        } else {
            board.push(new Pixel(j*size, i*size, size, secondaryColor, c))
        }
        
    }
}

let mouseState = false;

canvas.addEventListener('mousedown', () => {
    mouseState = true;
    let position = getMousePos(canvas, event);
    let x = Math.floor(position.x/size)
    let y = Math.floor(position.y/size)
    if(!eraser.checked) {
        board[x+y*dimension].draw(color.value)
    } else {
        board[x+y*dimension].erase()
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
        if(!eraser.checked) {
            board[x+y*dimension].draw(color.value)
        } else {
            board[x+y*dimension].erase()
        }
    }
    
})

function generateCode() {
    for(var y = 0; y < dimension; y++) {
        for(var x = 0; x < dimension; x++) {
            if(board[x+y*dimension].isSet()) {
                console.log(board[x+y*dimension].getColor())
                let color = hexToRgb(board[x+y*dimension].getColor())
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
    document.getElementById('codeViewer').innerHTML = generatedCode
    console.log(generatedCode);
})



// for(var i = 0; i < 32; i++) {
//     for(var j = 0; j < 32; j++) {
//         console.log(j, i);
//         let rnd = 250 + Math.random() * 5;
//         c.fillStyle = `rgba(${rnd}, ${rnd}, ${rnd})`;
//         //c.strokeStyle = '#dbdbdb';
//         c.fillRect(i*16, j*16, 16, 16);
//     }
// }

// function animateBoard() {
//     requestAnimationFrame(animateBoard)
//     c.clearRect(0, 0, 512, 512);
//     for(var i = 0; i < 64; i++) {
//         for(var j = 0; j < 64; j++) {
//             console.log(j, i);
//             let rnd = Math.random() * 255;
//             c.fillStyle = `rgba(${rnd}, ${rnd}, ${rnd})`;
//             //c.strokeStyle = '#dbdbdb';
//             c.fillRect(i*8, j*8, 8, 8);
//         }
//     }
// }
// animateBoard()

