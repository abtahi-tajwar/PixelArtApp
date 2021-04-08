const refCanvas = document.getElementById("refCanvas");
const mainCanvas = document.getElementById("mainCanvas");
const tempCanvas = document.getElementById("tempCanvas");

const canvas = {
    width: mainCanvas.width,
    height: mainCanvas.height
}

//accessing tools
const PalateColor = document.getElementById('color')
let elemColor = '#000000'
let selectedTool = 'line';
PalateColor.addEventListener('change', () => {
    elemColor = PalateColor.value;
    console.log(elemColor);
})
document.querySelectorAll('input[type=checkbox]').forEach(item => {
    item.addEventListener('change', (e) => {
        selectedTool = e.target.id;
        console.log(selectedTool)
        document.querySelectorAll('input[type=checkbox]').forEach(item => {
            if(item.id !== selectedTool) {
                item.checked = false;
            }
        })
    })
})

//Accessing code generator tools
const generateButton = document.getElementById("generate")
const popup = document.getElementById("popup")
const closepopup = document.getElementById("closepopup")

let elements = [];
let selectedElement = null;
let currentElement = null;




// Initializing canvas class
artboard = new Artboard(refCanvas, mainCanvas, tempCanvas);

//artboard.DrawMainBoard(elements);
//artboard.UpdateTempElement(elements[0], { x1: 150 });

const mouse = {
    x: undefined,
    y: undefined
}
let shiftDown = false;
let mouseDown = false;
let drawn = false;
let lineNumber = 0;
let polyNumber = 0;
let polyDrawMode = false;
document.addEventListener('mousemove', (e) => {
    pos = getMousePos(refCanvas, e)
    mouse.x = pos.x;
    mouse.y = pos.y;
    
})
document.addEventListener('keydown', (e) => {
    if(e.shiftKey) {
        shiftDown = true;
        console.log("ShiftDown", shiftDown)
    }
})
document.addEventListener('keyup', (e) => {
    if(e.which === 16) {
        shiftDown = false;
        console.log("ShiftDown", shiftDown)
    }
})
tempCanvas.addEventListener('mousedown', () => {

    // Handle Basic shapes
    if(selectedTool === 'line') {
        elements.push({name: "Line"+lineNumber++, elem: new Line(mouse.x, mouse.y, mouse.x, mouse.y, elemColor)});
        currentElement = elements[elements.length - 1].elem
        artboard.UpdateTempElement(currentElement, { x: mouse.x, y: mouse.y, x1: mouse.x, y1: mouse.y });
        //console.log(elements[0].elem.isSelected(mouse.x, mouse.y))  
    }    
    mouseDown = true;

    //Hangle polygon
    if(selectedTool === 'poly')
    {
        //console.log(shiftDown)
        //Handles the starting of the polygon drawing        
        if(shiftDown && polyDrawMode) {
            polyDrawMode = false;
            currentElement.end(tempCanvas);
            currentElement.draw(mainCanvas);
            document.getElementById('layers_panel').innerHTML += `
            <div class="layer_elem" id="layer${elements.length - 1}" onclick="selectElement(${elements.length - 1})">
                <p>${elements[elements.length - 1].name}</p>
            </div>
        ` 
        }
        //Check if user started to drawing polygon or not
        if(!shiftDown && !polyDrawMode) {
            polyDrawMode = true;
            elements.push({name: "Poly"+polyNumber++, elem: new Polygon(mouse.x, mouse.y, elemColor)});
            currentElement = elements[elements.length - 1].elem
            currentElement.init(tempCanvas, mouse.x, mouse.y)
        } else {
            if(!shiftDown) {
                currentElement.addPoint(tempCanvas, mouse.x, mouse.y);
            }
            
            //currentElement.draw(tempCanvas)
        }    
    }
})
tempCanvas.addEventListener('mouseup', () => {
    mouseDown = false; 
    if(selectedTool !== 'poly') {
        currentElement = null;
    }  
    
    if(drawn) {        
        artboard.ClearTemp();        
        artboard.DrawMainBoard(elements);
        drawn = false;
        
        document.getElementById('layers_panel').innerHTML += `
            <div class="layer_elem" id="layer${elements.length - 1}" onclick="selectElement(${elements.length - 1})">
                <p>${elements[elements.length - 1].name}</p>
            </div>
        `        
    } else {
        if( selectedTool === 'line') {
            elements.pop();
            lineNumber--; 
        }
         
    }    
    
})
document.addEventListener('mousemove', (e) => {
    pos = getMousePos(refCanvas, e)
    mouse.x = pos.x;
    mouse.y = pos.y;
    if(mouseDown && currentElement !== null && selectedTool !== 'poly') {
        drawn = true;        
        artboard.UpdateTempElement(currentElement, { x1: mouse.x, y1: mouse.y });
    }
    
})
function selectElement(elemN)
{
    selectedElement = elements[elemN];
    console.log(selectedElement)
    selectedElement.elem.highlight(tempCanvas);
    elements.forEach((elem, i) => {
        document.querySelector("#layer"+i).style.backgroundColor = '#ffffff';
    })
    document.querySelector("#layer"+elemN).style.backgroundColor = '#F5F5F5';
}

//Code generation
generateButton.addEventListener('click', () => {
    //console.log(generateCode(elements))
    popup.style.display = 'block'
    document.getElementById('codeViewer').value = generateCode(elements)
})
closepopup.addEventListener('click', function() {
    document.querySelector('.popup').style.display = 'none'
})