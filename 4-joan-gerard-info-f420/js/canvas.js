class Canvas{
    constructor(configuration, dcel) {
        this.width = configuration.width;
        this.height = configuration.height;
        this.pointsSize = configuration.pointsSize;
        this.selectedPoints = [];

        this.dcel = dcel;
    }

    setup() {
        createCanvas(this.width, this.height);
        fill('black');
    }

    draw() {
        background(200);
        this.drawVertices();
		this.drawEdges();
    }

    drawVertices() {
        for (let i in this.dcel.vertices) {
            fill(...this.dcel.vertices[i].color);
            ellipse(this.dcel.vertices[i].x, this.dcel.vertices[i].y, this.pointsSize, this.pointsSize);
        }
    }

    drawEdges() {
        this.dcel.edges.forEach(edge => {
            line(edge.vertexA.x, edge.vertexA.y, edge.vertexB.x, edge.vertexB.y);
        });
    }

    mouseClicked() {
        this.clickOnPoint(mouseX, mouseY);
        this.createEdge();
    }

    createEdge() {
        if (this.selectedPoints.length === 2) {
            // draw an edge
            const i = 0;
            line(this.selectedPoints[i].x, this.selectedPoints[i].y, this.selectedPoints[i+1].x, this.selectedPoints[i+1].y);

            // reset selected points list
            this.selectedPoints = [];
        }
    }

    clickOnPoint(mouseX, mouseY) {
        this.dcel.vertices.forEach(point => {
            if (this.pointInBetween(point, mouseX, mouseY)) {
                // point was clicked so change it to red if it was black
                if (point.color[0] === 0) {
                    point.color = [255, 0, 0] // red
                    this.selectedPoints.push(point);
                } else {
                    point.color = [0, 0, 0] // black
                    this.selectedPoints.pop();
                }
                
            }
        });
    }

    pointInBetween(point, mouseX, mouseY) {
        return (point.x - this.pointsSize / 2 < mouseX &&
            point.x + this.pointsSize / 2 > mouseX &&
            point.y - this.pointsSize / 2 < mouseY &&
            point.y + this.pointsSize / 2 > mouseY);
    }

    resetBoard() {
        clear();
    }
}