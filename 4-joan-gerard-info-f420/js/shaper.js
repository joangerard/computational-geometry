class Shaper {
    constructor(configuration){
        this.configuration = configuration;
    }

    getSquarePoints(margin) {

        let p1 = new Point(margin, margin); // upper-left 
        let p2 = new Point(this.configuration.width - margin, margin); // bottom-left
        let p3 = new Point(this.configuration.width - margin, this.configuration.height - margin); // bottom-right
        let p4 = new Point(margin, this.configuration.height - margin); // upper-right

        return [p1, p2, p3, p4];
    }
}