class Line {
    constructor(sx, sy, artboard, prevArtboard, dimension) {
        this.sx = sx
        this.sy = sy
        this.linePoints = []
        this.artboard = artboard
        this.prevArtboard = prevArtboard
        this.dimension = dimension
    }
    init(sx, sy) {
        this.sx = sx
        this.sy = sy
    }
    draw(ex, ey, color) {
        this.ex = ex
        this.ey = ey

        let x = this.sx, y = this.sy;
        let m = (this.ey*1.0 - this.sy*1.0)/(this.ex*1.0 - this.sx*1.0);
        // console.log(m)

        let diff = (Math.abs(m) <= 1) ? Math.abs(this.ex - this.sx) : Math.abs(this.ey - this.sy);
        this.removePoints()
        this.linePoints = []
        //glBegin(GL_POINTS);
        for(let i = 0; i <= diff; i++) {
            //glVertex2i(floor(x+0.5), floor(y+0.5));
            this.linePoints.push({x, y})
            //board[Math.round(x) + Math.round(y) * dimension].draw(color)
            if (Math.abs(m) <= 1) {
                x = x + (ex*1.0 - this.sx*1.0)/diff*1.0;
                if(ex < this.sx) {
                    y = y-m;
                } else {
                    y = y + m;
                }                
            } else if (Math.abs(m) > 1) {
                //console.log('Less')
                x = x + (ex*1.0 - this.sx*1.0)/diff*1.0;
                y = y + (ey*1.0 - this.sy*1.0)/diff*1.0;
            }
        }
        this.putPoints(color)
        //glEnd();
    }
    removePoints() {
        this.linePoints.forEach(item => {
            this.artboard.modifyPixel(Math.round(item.x), Math.round(item.y), {command: 'erase'})
        })
    }
    putPoints(color) {
        //console.log(this.linePoints)
        this.linePoints.forEach(item => {
            //this.board[Math.round(item.x) + Math.round(item.y) * this.dimension].draw(color)
            this.artboard.modifyPixel(Math.round(item.x), Math.round(item.y), {command: 'draw', color: color })
            this.prevArtboard.modifyPixel(Math.round(item.x), Math.round(item.y), {command: 'draw', color: color })
        })
    }
}