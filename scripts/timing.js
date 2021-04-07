/**
 * Cut-down timing class just for easily getting time since last frame.
 */
class Timing {
    constructor() {
        this.deltaTime = 0;
        this.lastTime = Date.now();
    }

    /**
     * Evoke this somewhere every frame to get accurate delta times.
     */
    update() {
        this.deltaTime = Date.now() - this.lastTime;
	    this.lastTime = Date.now();
    }
}

let timing = new Timing();