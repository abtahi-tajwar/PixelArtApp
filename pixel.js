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
    draw(color) {
        this.color = color
        this.c.clearRect(this.x, this.y, this.size, this.size)
        this.c.fillStyle = color
        this.c.fillRect(this.x, this.y, this.size, this.size)
        this.set = true
    }
    erase() {
        this.c.clearRect(this.x, this.y, this.size, this.size)
        this.c.fillStyle = this.defaultColor
        this.c.fillRect(this.x, this.y, this.size, this.size)
        this.set = false

    }
}