class Pixel {
    constructor(x = 0, y = 0, size = 16, color = '#fafafa', c) {
        this.size = size
        this.color = color
        this.x = x
        this.y = y
        this.c = c
        this.set = false
        this.defaultColor = color
        this.c.fillStyle = color
        this.c.fillRect(this.x, this.y, this.size, this.size)
    }
    isSet() {
        return this.set
    }
    getColor() {
        return this.color
    }
    draw(color = this.color, set = true) {
        this.color = color
        this.c.clearRect(this.x, this.y, this.size, this.size)
        this.c.fillStyle = color
        this.c.fillRect(this.x, this.y, this.size, this.size)
        this.set = set
    }
    redraw(color = this.color) {
        console.log(this.set)
        this.color = color
        this.c.clearRect(this.x, this.y, this.size, this.size)
        this.c.fillStyle = color
        this.c.fillRect(this.x, this.y, this.size, this.size)
    }
    save(color) {
        this.color = color;
        this.set = true;
    }
    removeSaved() {
        this.color = this.defaultColor;
        this.set = false;
    }
    erase() {
        this.c.clearRect(this.x, this.y, this.size, this.size)
        this.c.fillStyle = this.defaultColor
        this.c.fillRect(this.x, this.y, this.size, this.size)
        this.set = false

    }
    getInfo() {
        return {
            set: this.set,
            color: this.color,
            x: this.x,
            y: this.y
        }
    }
}