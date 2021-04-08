function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

class Artboard {
    constructor(dimension = 512, pixel = 32, c) {
        this.dimension = dimension;
        this.pixel = pixel;
        this.size = this.dimension/this.pixel;
        this.board = [];
        this.primaryColor = '#fafafa';
        this.secondaryColor = '#dedede';

        for(let i = 0; i < this.pixel; i++) {
            for(let j = 0; j < this.pixel; j++) {
                if((i+j)%2 == 0) {
                    this.board.push(new Pixel(j*this.size, i*this.size, this.size, this.primaryColor, c))
                } else {
                    this.board.push(new Pixel(j*this.size,  i*this.size, this.size, this.secondaryColor, c))
                }
                
            }
        }       
    }
    initBoard()
    {
        for(let i = 0; i < this.pixel; i++) {
            for(let j = 0; j < this.pixel; j++) {
                if((i+j)%2 == 0) {
                    this.board.push(new Pixel(j*this.size, i*this.size, this.size, this.primaryColor, c))
                } else {
                    this.board.push(new Pixel(j*this.size,  i*this.size, this.size, this.secondaryColor, c))
                }
                
            }
        }
    }
    drawBoard() {       
        for(let i = 0; i < this.pixel*this.pixel; i++) {          
            this.board[i].redraw();
        }
    }
    drawImage(imgData, width, height, pixelSize)
    {
        let data = [];
        for(let y = 0; y < height; y++) {
            let row = [];
            for(let x = 0; x < width; x++) {
                let r = imgData[(y * 4 * width) + (x * 4)];
                let g = imgData[(y * 4 * width) + (x * 4 + 1)];
                let b = imgData[(y * 4 * width) + (x * 4 + 2)];
                row.push({r, g, b})
            }
            data.push(row);
        }
        let pixelatedData = [];
        for(let y = 0; y < height; y += pixelSize) {
            let row = [];
            for(let x = 0; x < width; x += pixelSize) {
                let r = 0, g = 0, b = 0;
                for(let j = y; j < y + pixelSize; j++) {
                    if(j >= height) {
                        break;
                    }
                    for(let i = x; i < x + pixelSize; i++) {
                        //console.log(j);
                        r += data[j][i].r;
                        g += data[j][i].g;
                        b += data[j][i].b;
                    }
                }                
                r = r/(pixelSize*pixelSize);
                g = g/(pixelSize*pixelSize);
                b = b/(pixelSize*pixelSize);
                row.push({r, g, b});
            }
            pixelatedData.push(row);
        }
        //console.log(pixelatedData)
          
        
        pixelatedData.forEach((row, y) => {
            row.forEach((cell, x) => {
                const hex =  rgbToHex(Math.round(cell.r), Math.round(cell.g), Math.round(cell.b))
                console.log(hex)
                this.board[x + y*dimension].draw(hex)
            })
        })

    }
    copyBoard(sheet) {
        for(let i = 0; i < this.pixel*this.pixel; i++) {           
            this.board[i].draw(sheet.getPixelInfo(i).color, sheet.getPixelInfo(i).set);
        }
    }
    modifyPixel(x, y, params)
    {
        if(params.command === 'draw') {
            this.board[x + y*dimension].draw(params.color);
        }
        else if(params.command === 'erase') {
            this.board[x + y*dimension].erase();
        }
    }
    savePixelInfo(x, y, params) {
        if(params.command === 'erase') {
            this.board[x + y*dimension].removeSaved();
            return
        }
        this.board[x + y*dimension].save(params.color);
    }
    getColor(x, y) {
        return this.board[x + y*dimension].getColor();
    }
    getPixelInfo(i) {
        return this.board[i].getInfo();
    }
    isSet(x, y) {
        return this.board[x + y*dimension].isSet();
    }
}