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
        this.$screen = $(".screen");
        this.$pets = [$("#p0"), $("#p1"), $("#p2")]
        this.$music = $(".music");
        this.$food = $(".food");
        this.$hand = $(".clock-hand");
        $("#b0").on("click", function(e) {game.pressBrown();});
        $("#b1").on("click", function(e) {game.pressBlue();});
        $("#b2").on("click", function(e) {game.pressGreen();});

        setInterval(this.update, 100);
    }

    update() {
        if (this.on) {
            this.updateClock();
        }
    }

    togglePower() {
        this.on = !this.on;
        

        if (this.on) {
            this.updateClock();
            this.$screen.css("display", "initial");
        }
        else {
            this.resetClock();
            this.$screen.css("display", "none");
        }

        return this.on;
    }

    pressBrown() {
        if (!this.on) this.togglePower();

        console.log("Brown");
    }

    pressBlue() {
        if (!this.on) this.togglePower();

        console.log("Blue");
    }

    pressGreen() {
        if (!this.on) this.togglePower();
        
        console.log("Green");
    }

    updateClock() {
        let time = new Date();
        let rotation = ((time.getHours() % 12 / 12) + (time.getMinutes() / 60 / 12)) * 360;
        console.log(rotation);
        this.$hand.css("transform", `rotate(${rotation}deg)`);
    }

    resetClock() {
        this.$hand.css("transform", "rotate(0)");
    }

    updateStats() {

    }
}

const game = new Game();