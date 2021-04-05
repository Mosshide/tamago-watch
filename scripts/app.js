class Pet {
    constructor() {
        this.name = "";
        this.age = 0;
        this.hunger = 0;
        this.sleepiness = 0;
        this.boredom = 0;
        this.stage = 0;
        this.tilNext = 10000;
        this.state = 0;
    }

    update() {

    }

    toggleFeeding() {
        return this.hunger;
    }

    toggleSleeping() {
        return this.sleepiness;
    }

    toggleDancing() {
        return this.boredom;
    }
}

class Game {
    constructor() {
        this.on = false;
        this.pet = new Pet();
    }

    update() {
        
    }

    togglePower() {
        return this.on;
    }

    pressBrown() {
        
    }

    pressBlue() {
        
    }

    pressGreen() {
        
    }
}