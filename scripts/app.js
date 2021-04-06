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
        this.$pets = [$("#p0"), $("#p1"), $("#p2")];
        this.pics = ["img/mon_base.png"];
        this.currentPic = "img/mon_base.png";
    }

    update() {
        this.changePic();
        this.moveRandomly();
    }

    birth() {

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

    rename(name) {
        this.name = name;
    }

    moveRandomly() {
        this.clearDisplay();

        let chosen = Math.floor(Math.random() * 3);
        this.$pets[chosen].attr("src", this.currentPic);
        this.$pets[chosen].css("display", "initial");
    }

    changePic() {

    }

    clearDisplay() {
        for (let i = 0; i < 3; i++) {
            this.$pets[i].css("display", "none");
        }
    }
}

class Game {
    constructor() {
        this.on = false;
        this.pet = new Pet();
        this.$screen = $(".screen");
        this.$music = $(".music");
        this.$food = $(".food");
        this.$hand = $(".clock-hand");
        $("#b0").on("click", function(e) {game.pressBrown();});
        $("#b1").on("click", function(e) {game.pressBlue();});
        $("#b2").on("click", function(e) {game.pressGreen();});

        setInterval(function() {game.update();}, 1000);
    }

    update() {
        if (this.on) {
            this.updateClock();
            this.pet.update();
        }
    }

    togglePower() {
        this.on = !this.on;
        

        if (this.on) {
            this.updateClock();
            this.$screen.css("display", "initial");
            this.$screen.toggleClass("bloom");
            $("main").css("background-color", "var(--extreme-dark)");
        }
        else {
            this.resetClock();
            this.$screen.css("display", "none");
            this.$screen.toggleClass("bloom");
            $("main").css("background-color", "var(--very-dark)");
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
        this.$hand.css("transform", `rotate(${rotation}deg)`);
    }

    resetClock() {
        this.$hand.css("transform", "rotate(0)");
    }

    updateStats() {

    }
}
const game = new Game();