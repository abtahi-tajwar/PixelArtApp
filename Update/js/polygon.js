class Polygon
{
    constructor(x, y, color="#000000", weight = 1)
    {
        this.x = x;
        this.y = y;
        this.color = color;
        this.weight = weight;
        this.points = [this.x, this.y]
        this.openglCode = "";
    }
    init(canvas, x, y)
    {
        const c = canvas.getContext('2d')
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.lineWidth = this.weight;
        c.strokeStyle = this.color;
        c.beginPath();
        c.moveTo(this.x, this.y)
        this.points.push(x);
        this.points.push(y);
    }  
    addPoint(canvas, x, y)
    {
        const c = canvas.getContext('2d')
        this.points.push(x);
        this.points.push(y);
        c.lineTo(x, y);
        c.stroke();
    }
    end(canvas)
    {
        const c = canvas.getContext('2d')
        c.closePath();
    }
    update(canvas, config)
    {
        const tc = canvas.getContext('2d')
        tc.clearRect(0, 0, canvas.width, canvas.height);        
        if("tempX" in config)
        {            
            this.points[this.points.length-2] = config.x1;
            this.draw(canvas);
        }
        if("tempY" in config)
        {
            this.points[this.points.length-1] = config.y1;
            this.draw(canvas);
        }
    }
 
    draw(canvas)
    {
        const c = canvas.getContext('2d')
        c.lineWidth = this.weight;
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(this.points[0], this.points[1])
        for(let i = 2; i < this.points.length; i += 2)
        {
            c.lineTo(this.points[i], this.points[i+1])
        }        
        c.closePath();
        c.fill();
        //c.stroke();
    }
    highlight(canvas)
    {
        const c = canvas.getContext('2d')
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.lineWidth = this.weight + 3;
        c.strokeStyle = '#0062ff';
        c.beginPath();
        c.moveTo(this.points[0], this.points[1])
        for(let i = 2; i < this.points.length; i += 2)
        {
            c.lineTo(this.points[i], this.points[i+1])
        }        
        c.closePath();
        c.stroke();
        c.strokeStyle = this.color;
        c.lineWidth = this.weight;
    }
    openGLOutput()
    {
        const rgb = hexToRgb(this.color)
        this.openglCode += `
            glBegin(GL_POLYGON);
            glColor3ub(${rgb.r},${rgb.g},${rgb.b});
            `
        for(let i = 2;  i < this.points.length; i += 2)
        {
            this.openglCode += `    glVertex2i(${Math.floor(this.points[i])}, ${Math.floor(canvas.width - this.points[i+1])});
            `
        }
        this.openglCode += "glEnd();";
        return this.openglCode
    }
}