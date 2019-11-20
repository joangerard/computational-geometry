class Dcel {
    constructor(vertices) {
        this.vertices = vertices;
        this.faces = [];
        this.edges = [];
        this.numberOfFaces = 2;
        this.init();
    }

    init() {
        // create the outter and inner faces
        let outterFace = new Face(0);
        let innerFace = new Face(1);
        let vertexOrigin = this.vertices[0];

        // add them to the faces list
        this.faces.push(outterFace);
        this.faces.push(innerFace);

        // create edges
        for (let i = 0; i < this.vertices.length - 1; i++) {
            // create edges
            let edgeInner = this.createEdgeFromTo(i, i+1, innerFace, outterFace, vertexOrigin);

            // just add principal edges to this list
            this.edges.push(edgeInner);
        }

        // create the last edge
        this.edges.push(
            this.createEdgeFromTo(this.vertices.length-1, 0, innerFace, outterFace, vertexOrigin)
            );

        // link edges: previous, next
        for (let i = 0; i < this.edges.length; i++) {
            // first edge
            if (i === 0) {
                this.edges[i].previous = this.edges[this.edges.length-1];
                this.edges[i].next = this.edges[i+1];
            } 
            // last edge
            else if(i === this.edges.length - 1) {
                this.edges[i].previous = this.edges[i-1];
                this.edges[i].next = this.edges[0];
            }
            // other edge
            else {
                this.edges[i].next = this.edges[i+1];
                this.edges[i].previous = this.edges[i-1];
            }
        }
    }

    addEdge(vertexA, vertexB) {
        let aux, next;
        // create new edge
        let newEdge = new Edge(vertexA, vertexB);
        newEdge.twin = new Edge(vertexB, vertexA);

        //create new face
        this.numberOfFaces++;
        let newFace = new Face(this.numberOfFaces);
        this.faces.push(newFace);

        // get the edge that goes through vertexA and vertexB
        let sourceEdge = this.searchEdge(vertexA, this.checkVertexBEquals);
        let targetEdge = this.searchEdge(vertexB, this.checkVertexBEquals);

        // FIRST FACE:
        // update links
        newEdge.next = targetEdge.next;
        newEdge.previous = sourceEdge;
        // save it before losing it.
        aux = sourceEdge.next;
        sourceEdge.next = newEdge;
        targetEdge.next.previous = newEdge;
        
        // update origin
        newEdge.origin = newEdge.vertexA;
        next = newEdge.next;
        while (next !== newEdge) {
            next.origin = newEdge.origin;
            next = next.next;
        }

        // SECOND FACE:
        //update links
        newEdge.twin.next = aux;
        newEdge.twin.previous = targetEdge;
        aux.previous = newEdge.twin
        targetEdge.next = newEdge.twin;

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

        this.edges.push(newEdge);
    }


    checkVertexBEquals(vertex) {
        return function (edge) {
            return edge.vertexB === vertex;
        }
    }


    searchEdge(vertex, checkVertex) {
        let edgeFound = null;

        return this.edges.filter(checkVertex(vertex))[0];
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

        return edgeInner;
    }
}