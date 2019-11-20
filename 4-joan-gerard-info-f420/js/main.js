let configuration = new Configuration();
let shaper = new Shaper(configuration);
// create square
let points = shaper.getSquarePoints(30);
let dcel = new Dcel(points);

let canvas = new Canvas(configuration, dcel);
let orchestrator = new Orchestrator(canvas);


function reset(){
    canvas.resetBoard();
}

function setup() {
    canvas.setup();
}

function draw() {
    canvas.draw();
}

function mouseClicked() {
    canvas.mouseClicked();
}