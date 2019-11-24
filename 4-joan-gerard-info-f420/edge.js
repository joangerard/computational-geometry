class Edge {
    constructor(vertexA, vertexB) {
        this.vertexA = vertexA;
        this.vertexB = vertexB;

        this.twin = null;
        this.origin = null;
        this.next = null;
        this.previous = null;
        this.face = null;
    }
}