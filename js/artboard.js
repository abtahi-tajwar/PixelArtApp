class Artboard {
    constructor(dimension = 512, pixel = 32, c, color = undefined) {
        this.dimension = dimension;
        this.pixel = pixel;
        this.size = this.dimension/this.pixel;
        this.board = [];

        this.primaryColor = '#fafafa';
        this.secondaryColor = '#dedede';
        if(color === undefined) {
            for(let i = 0; i < this.pixel; i++) {
                for(let j = 0; j < this.pixel; j++) {
                    if((i+j)%2 == 0) {
                        this.board.push(new Pixel(j*this.size, i*this.size, this.size, this.primaryColor, c))
                    } else {
                        this.board.push(new Pixel(j*this.size,  i*this.size, this.size, this.secondaryColor, c))
                    }
                    
                }
            }
        } else {
            for(let i = 0; i < this.pixel; i++) {
                for(let j = 0; j < this.pixel; j++) {
                    this.board.push(new Pixel(j*this.size, i*this.size, this.size, color, c))
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
            this.board[i].draw();
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