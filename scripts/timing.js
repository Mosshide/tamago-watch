class Timing {
    constructor(active, type, div, xOrder) {
        this.deltaTime = Date.now();
        this.lastTime = this.deltaTime;
        this.fps = 10;
    }

    update() {
        this.deltaTime = Date.now() - this.lastTime;
	    this.lastTime = Date.now();
    }
}

let timing = new Timing();