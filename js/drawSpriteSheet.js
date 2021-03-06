//Getting spritesheet dom
const finalSpriteSheet = document.getElementById('finalCanvas');
const fc = finalSpriteSheet.getContext('2d')

//Calculating dimension of the final sheet
const pixelSize = 2;
const sheetWidth = pixelSize*pixels*sheetSizeX;
const sheetHeight = pixelSize*pixels*sheetSizeY;


//Setting up the dimension of final sheet
finalSpriteSheet.height = sheetHeight
finalSpriteSheet.width = sheetWidth

//Declaring sprite sheet for drawing on single sheet
function generateSpriteSheet() {
    for(let x = 0; x < sheetSizeX; x++) {
        for(let y = 0; y < sheetSizeY; y++) {
            for(let i = 0; i < pixels*pixels; i++) {
                drawToSheet(sheets[y][x], x, y, i)
            }
        }
        
    }
}
function drawToSheet(sheet, x, y, i) {
    const info = sheet.getPixelInfo(i)
    if(info.set) {
        console.log(x*pixelSize*pixels + i%pixels*pixelSize, y*pixelSize*pixels + Math.floor(i/pixels))
        fc.clearRect(x*pixelSize*pixels + i%pixels*pixelSize, y*pixelSize*pixels + Math.floor(i/pixels)*pixelSize, pixelSize, pixelSize);
        fc.fillStyle = info.color
        fc.fillRect(x*pixelSize*pixels + i%pixels*pixelSize, y*pixelSize*pixels + Math.floor(i/pixels)*pixelSize, pixelSize, pixelSize);
    } else {
        fc.clearRect(x*pixelSize*pixels + i%pixels*pixelSize, y*pixelSize*pixels + Math.floor(i/pixels)*pixelSize, pixelSize, pixelSize);
        fc.fillStyle = 'white'
        fc.fillRect(x*pixelSize*pixels + i%pixels*pixelSize, y*pixelSize*pixels + Math.floor(i/pixels)*pixelSize, pixelSize, pixelSize);
    }
}
document.getElementById('generate').addEventListener('click', (e) => {
    e.preventDefault()
    finalSpriteSheet.style.transform = 'scale('+512/sheetWidth+','+512/sheetWidth+')'
    document.querySelector('.final-canvas').style.display = 'flex';
    generateSpriteSheet()
})
document.getElementById('close_preview').addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.final-canvas').style.display = 'none';
})