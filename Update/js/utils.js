function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
//Extracting r,g,b values from hex code
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

function pointDistance(x, y, x1, y1)
{
    const xDist = x - x1;
    const yDist = y - y1;
    return Math.sqrt(xDist*xDist + yDist*yDist);
}
function normalize(x, y, w, h)
{
    pos = {};
    pos.x = Math.round(((x - w / 2) / (w / 2)) * 100)/100;
    pos.y = -Math.round(((y - h / 2) / (h / 2)) * 100)/100;
    return pos;
}
