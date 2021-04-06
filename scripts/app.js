class Pet {
    constructor() {
        this.name = "";
        this.age = 0;
        this.hunger = 5;
        this.sleepiness = 7;
        this.boredom = 9;
        this.stage = 0;
        this.tilNext = 10000;
        this.state = "idle";
        this.$pets = [$("#p0"), $("#p1"), $("#p2")];
        this.pics = ["img/mon_base.png"];
        this.currentPic = "img/mon_base.png";
    }

    update() {
        this.changePic();
        if (this.state !== "sleeping") this.moveRandomly();
    }

    birth() {

    }

    toggleFeeding() {
        if (this.state !== "feeding") {
            this.state = "feeding";
        }
        else this.state = "idle";

        return this.hunger;
    }

    toggleSleeping() {
        if (this.state !== "sleeping") {
            this.state = "sleeping";
        }
        else this.state = "idle";

        return this.sleepiness;
    }

    toggleDancing() {
        if (this.state !== "dancing") {
            this.state = "dancing";
        }
        else this.state = "idle";
        
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

    getStats() {
        return [this.hunger, this.sleepiness, this.boredom];
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
        this.statusBars = [$("#s0"), $("#s1"), $("#s2")];
        $("#b0").on("click", function(e) {game.pressBrown();});
        $("#b1").on("click", function(e) {game.pressBlue();});
        $("#b2").on("click", function(e) {game.pressGreen();});

        setInterval(function() {game.update();}, 1000);
    }

    update() {
        if (this.on) {
            this.updateClock();
            this.pet.update();
            this.updateStats();
        }
    }

    togglePower() {
        this.on = !this.on;
        

        if (this.on) {
            this.updateClock();
            this.$screen.css("display", "initial");
            this.$screen.toggleClass("bloom");
            $("main").css("background-color", "var(--extreme-dark)");
            this.updateStats();
        }
        else {
            this.resetClock();
            this.$screen.css("display", "none");
            this.$screen.toggleClass("bloom");
            $("main").css("background-color", "var(--very-dark)");
            this.updateStats();
        }

        return this.on;
    }

    pressBrown() {
        if (!this.on) this.togglePower();
        else {
            this.pet.toggleFeeding();

            if (this.$music.css("display") !== "none") this.$music.css("display", "none");

            if (this.$food.css("display") === "none") {
                this.$food.css("display", "initial");
            }
            else {
                this.$food.css("display", "none");
            }
        }

        console.log("Brown");
    }

    pressBlue() {
        if (!this.on) this.togglePower();
        else {
            this.pet.toggleSleeping();

            if (this.$food.css("display") !== "none") this.$food.css("display", "none");
            if (this.$music.css("display") !== "none") this.$music.css("display", "none");

            this.$screen.toggleClass("bloom");
        }

        console.log("Blue");
    }

    pressGreen() {
        if (!this.on) this.togglePower();
        else {
            this.pet.toggleDancing();

            if (this.$food.css("display") !== "none") this.$food.css("display", "none");
            
            if (this.$music.css("display") === "none") {
                this.$music.css("display", "initial");
            }
            else {
                this.$music.css("display", "none");
            }
        }
        
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
        let stats = this.pet.getStats();

        for (let i = 0; i < 3; i++) {
            let bar = this.statusBars[i];

            for (let j = 0; j < 10; j++) {
                bar.children().eq(j).css("display", "none");
            }

            if (this.on) {
                for (let j = 0; j < stats[i]; j++) {
                    bar.children().eq(j).css("display", "initial");
                }
            }
        }
    }
}
const game = new Game();