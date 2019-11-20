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
                this.edges[i].next = this.edges[i+1]
            } 
            // last edge
            else if(i === this.edges.length - 1) {
                this.edges[i].previous = this.edges[i-1];
            }
            // other edge
            else {
                this.edges[i].next = this.edges[i+1];
                this.edges[i].previous = this.edges[i-1];
            }
        }
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