class Dcel {
    constructor(vertices) {
        this.vertices = vertices;
        this.faces = [];
        this.edges = [];
        this.numberOfFaces = 1;
        this.init();
    }

    init() {
        // create the outter and inner faces
        let outterFace = new Face('outer');
        let innerFace = new Face(1);
        let vertexOrigin = this.vertices[0];

        // add them to the faces list
        this.faces.push(outterFace);
        this.faces.push(innerFace);

        // create edges
        for (let i = 0; i < this.vertices.length - 1; i++) {
            // create edges
            let newEdges = this.createEdgeFromTo(i, i+1, innerFace, outterFace, vertexOrigin);
            let edgeInner = newEdges[0];
            let edgeOutter = newEdges[1];

            if (i === 0) {
                outterFace.edge = edgeOutter;
                innerFace.edge = edgeInner;
            }

            // just add principal edges to this list
            this.edges.push(edgeInner);
        }

        // create the last edge
        this.edges.push(
            this.createEdgeFromTo(this.vertices.length-1, 0, innerFace, outterFace, vertexOrigin)[0]
            );

        // link edges: previous, next
        for (let i = 0; i < this.edges.length; i++) {
            // first edge
            if (i === 0) {
                // inner face: anticlockwise
                this.edges[i].previous = this.edges[this.edges.length-1];
                this.edges[i].next = this.edges[i+1];
                // outter face: clockwise
                this.edges[i].twin.previous = this.edges[i+1].twin;
                this.edges[i].twin.next = this.edges[this.edges.length-1].twin;
            } 
            // last edge
            else if(i === this.edges.length - 1) {
                // inner face: anticlockwise
                this.edges[i].previous = this.edges[i-1];
                this.edges[i].next = this.edges[0];
                // outter face: clockwise
                this.edges[i].twin.previous = this.edges[0].twin;
                this.edges[i].twin.next = this.edges[i-1].twin;
            }
            // other edge
            else {
                // inner face: anticlockwise
                this.edges[i].next = this.edges[i+1];
                this.edges[i].previous = this.edges[i-1];
                // outter face: clockwise
                this.edges[i].twin.next = this.edges[i-1].twin;
                this.edges[i].twin.previous = this.edges[i+1].twin;
            }
        }
    }

    addVertex(vertex, onEdge) {
        let edgeA = new Edge(onEdge.vertexA, vertex);
        let edgeB = new Edge(vertex, onEdge.vertexB);

        edgeA.next = edgeB;
        edgeB.next = onEdge.next;
        edgeA.previous = onEdge.previous;
        edgeB.previous = edgeA;
        edgeA.origin = onEdge.origin;
        edgeB.origin = onEdge.origin;
        onEdge.previous.next = edgeA;
        onEdge.next.previous = edgeB;

        // update twins
        edgeA.twin = new Edge(vertex, onEdge.vertexA);
        edgeB.twin = new Edge(onEdge.vertexB, vertex);

        edgeA.twin.next = onEdge.twin.next;
        edgeB.twin.next = edgeA.twin;
        edgeA.twin.previous = edgeB.twin;
        edgeB.twin.previous = onEdge.twin.previous;
        edgeA.twin.origin = onEdge.twin.origin;
        edgeB.twin.origin = onEdge.twin.origin;
        onEdge.twin.previous.next = edgeB.twin;
        onEdge.twin.next.previous = edgeA.twin;

        // update faces edge
        onEdge.face.edge = edgeA;
        onEdge.twin.face.edge = edgeA.twin;
        edgeA.face = onEdge.face
        edgeB.face = onEdge.face;
        edgeA.twin.face = onEdge.twin.face;
        edgeB.twin.face = onEdge.twin.face;

        // remove old edge
        let index = this.edges.indexOf(onEdge);
        if (index > -1) {
            this.edges.splice(index, 1);

            // add new edges
            this.edges.splice(index, 0, edgeB);
            this.edges.splice(index, 0, edgeA);
        } else {
            console.log("[INFO]: Error while searching edge.");
        }

        this.vertices.push(vertex);
    }

    addEdge(vertexA, vertexB) {
        let aux, next, auxPrev;
        // create new edge
        let newEdge = new Edge(vertexA, vertexB);
        newEdge.twin = new Edge(vertexB, vertexA);

        //create new face
        this.numberOfFaces++;
        let newFace = new Face(this.numberOfFaces);
        newFace.edge = newEdge;
        this.faces.push(newFace);

        // get the edge that goes through vertexA and vertexB
        let edgesCandidates = this.searchEdges(vertexB, vertexA);
        if (edgesCandidates[0] === null) {
            edgesCandidates = this.searchEdges(vertexA, vertexB);
        }
        let sourceEdge = edgesCandidates[0];
        let targetEdge = edgesCandidates[1];

        // FIRST FACE:
        // update links
        newEdge.next = sourceEdge;
        newEdge.previous = targetEdge;
        // save it before losing it.
        aux = sourceEdge.previous;
        auxPrev = targetEdge.next;
        sourceEdge.previous = newEdge;
        targetEdge.next = newEdge;
        
        // update origin
        newEdge.origin = newEdge.vertexA;
        next = newEdge.next;
        while (next !== newEdge) {
            next.origin = newEdge.origin;
            next = next.next;
        }

        // SECOND FACE:
        //update links
        newEdge.twin.next = auxPrev;
        newEdge.twin.previous = aux;
        aux.next = newEdge.twin
        auxPrev.previous = newEdge.twin;

        // update origin
        newEdge.twin.origin = newEdge.twin.vertexA;
        next = newEdge.twin.next;
        while(next !== newEdge.twin) {
            next.origin = newEdge.twin.origin;
            next = next.next;
        }

        // update only half of the edges faces, the rest does not change.
        newEdge.face = newFace;
        next = newEdge.next;

        while(next !== newEdge) {
            next.face = newFace;
            next = next.next;
        }

        // update the twin's face aswell
        newEdge.twin.face = newEdge.twin.next.face;

        //update faces edges
        newEdge.face.edge = newEdge;
        newEdge.twin.face.edge = newEdge.twin;

        this.edges.push(newEdge);
    }

    checkVertexAEquals(vertex) {
        return function (edge) {
            return edge.vertexA === vertex;
        }
    }

    checkVertexBEquals(vertex) {
        return function (edge) {
            return edge.vertexB === vertex;
        }
    }


    searchEdges(vertexA, vertexB) {
        let candidatesEdgesA = this.edges.filter(this.checkVertexAEquals(vertexA));
        let selectedCandidateA = null;
        let selectedCandidateB = null;
        let found = false;
        candidatesEdgesA.forEach(edgeA => {
            let i = edgeA.next;
            // walk to find the edge at the other side of the face
            do {
                if (i.vertexB === vertexB) {
                    selectedCandidateA = edgeA;
                    selectedCandidateB = i;
                    found = true;
                }
                i = i.next;
            } while(i.vertexA !== vertexA && !found); // we made a complete tour.
        });
        
        return [selectedCandidateA, selectedCandidateB];
    }

    createEdgeFromTo(i, j, face1, face2, vertexOrigin) {
        let vertexA = this.vertices[i];
        let vertexB = this.vertices[j];
        
        // create inner and outter edge
        let edgeInner = new Edge(vertexA, vertexB);
        let edgeOutter = new Edge(vertexB, vertexA);

        // set edges origin
        edgeInner.origin = vertexOrigin;
        edgeOutter.origin = vertexOrigin;

        // set edges faces
        edgeInner.face = face1;
        edgeOutter.face = face2;

        // set twins
        edgeInner.twin = edgeOutter;
        edgeOutter.twin = edgeInner;

        return [edgeInner, edgeOutter];
    }
}