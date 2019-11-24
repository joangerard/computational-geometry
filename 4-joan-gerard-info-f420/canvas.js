class Canvas{
    constructor(configuration, dcel) {
        this.width = configuration.width;
        this.height = configuration.height;
        this.pointsSize = configuration.pointsSize;
        this.selectedPoints = [];

        this.dcel = dcel;
    }

    setup() {
        let canvas = createCanvas(this.width, this.height);
        // Move the canvas so it’s inside our <div id="sketch-holder">.
        canvas.parent('sketch-holder');
        fill('black');
        this.updateFacesList();
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
        if (!this.clickOnPoint(mouseX, mouseY)) {
            this.clickOnEdge(mouseX, mouseY);
        }
        
        this.createEdge();
        this.updateFacesList();
    }

    clickOnEdge(mouseX, mouseY) {
        let clickedEdge = null;
        let shouldAddVertex = false;
        let vertexC = new Point(mouseX, mouseY);
        this.dcel.edges.forEach(edge => {
            if (this.isBetween(edge.vertexA, edge.vertexB, vertexC)
                || this.isNearSegment(edge.vertexA, edge.vertexB, mouseX, mouseY)) {
                clickedEdge = edge;
                shouldAddVertex = true;
            }
        });
        if (shouldAddVertex) {
            this.dcel.addVertex(vertexC, clickedEdge);
        }
    }

    isBetween(a, b, c){
        let crossproduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);

        if (Math.abs(crossproduct) > 0){
            return false;
        }

        let dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y)*(b.y - a.y);
        if (dotproduct < 0){
            return false;
        }

        let squaredlengthba = (b.x - a.x)*(b.x - a.x) + (b.y - a.y)*(b.y - a.y);
        if (dotproduct > squaredlengthba){
            return false
        }

        return true;
    }

    isNearSegment(p1, p2, mouseX, mouseY) {
        let minDistance = 5;

        let distance = Math.abs((p2.y - p1.y)*mouseX - (p2.x - p1.x)*mouseY + p2.x*p1.y - p2.y*p1.x);
        distance = distance / (Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x,2)));

        return distance < minDistance;
    }

    updateFacesList() {
        let facesList = document.getElementById('faces-list');
        facesList.innerHTML = '';

        this.dcel.faces.forEach(face => {
            // face name
            let liFaceName = document.createElement('li');
            liFaceName.innerHTML = `Face ${face.name}`
            facesList.appendChild(liFaceName);

            // list of vertices

            let edge = face.edge.next;

            do {
                let ul = document.createElement('ul');
                ul.innerHTML = `(${edge.vertexA.x}, ${edge.vertexA.y})  -> (${edge.vertexB.x}, ${edge.vertexB.y})`;
                liFaceName.appendChild(ul);
                edge = edge.next;
            } while(edge != face.edge.next);
        });
    }

    createEdge() {
        if (this.selectedPoints.length === 2) {
            // add edge to dcel structure and update it
            this.dcel.addEdge(this.selectedPoints[0], this.selectedPoints[1]);

            // get the points color back to black.
            setTimeout(() => {
                this.selectedPoints[0].color = [0,0,0];
                this.selectedPoints[1].color = [0,0,0];

                // reset selected points list
                this.selectedPoints = [];
            }, 1000);
        }
    }

    clickOnPoint(mouseX, mouseY) {
        let pointWasSelected = false;
        this.dcel.vertices.forEach(point => {
            if (this.pointInBetween(point, mouseX, mouseY)) {
                pointWasSelected = true;
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
        return pointWasSelected;
    }

    pointInBetween(point, mouseX, mouseY) {
        return (point.x - this.pointsSize / 2 < mouseX &&
            point.x + this.pointsSize / 2 > mouseX &&
            point.y - this.pointsSize / 2 < mouseY &&
            point.y + this.pointsSize / 2 > mouseY);
    }

    resetBoard(dcel) {
        this.dcel = dcel
        clear();
    }
}