class Pet {
    constructor() {
        this.name = "";
        this.age = 0;
        this.hunger = 5;
        this.sleepiness = 5;
        this.boredom = 5;
        this.secondsPerFill = 10;
        this.tilNextFill = this.secondsPerFill * 1000;
        this.secondsPerDrain = 1;
        this.tilNextDrain = this.secondsPerDrain * 1000;
        this.stage = 0;
        this.tilNextStage = 10000;
        this.state = "idle";
        this.$pets = [$("#p0"), $("#p1"), $("#p2")];
        this.spot = 0;
        this.pics = {
            idle: "img/mon_base.png",
            stand: "img/mon_stand.png",
            sleep: "img/mon_sleep.png",
            eat: "img/mon_eat.png",
            dead: "img/mon_dead.png"
        };
        this.currentPic = this.pics.idle;
    }

    update() {
        this.changePic();

        if (this.state !== "dead") {
            if (this.state !== "sleeping") {
                if (this.state === "idle") this.moveRandomly();
                if (this.state === "feeding") {
                    this.moveFeeding();
    
                    this.tilNextDrain -= timing.deltaTime;
                    if (this.tilNextDrain <= 0) {
                        this.hunger--;
                        if (this.hunger < 0) this.hunger = 0;
                        this.tilNextDrain = this.secondsPerDrain * 1000;
                    }
                }
                if (this.state === "dancing") {
                    this.moveDancing();
    
                    this.tilNextDrain -= timing.deltaTime;
                    if (this.tilNextDrain <= 0) {
                        this.boredom--;
                        if (this.boredom < 0) this.boredom = 0;
                        this.tilNextDrain = this.secondsPerDrain * 1000;
                    }
                }
    
                this.tilNextFill -= timing.deltaTime;
                if (this.tilNextFill <= 0) {
                    switch (Math.floor(Math.random() * 3)) {
                        case 0:
                            this.hunger++;
                            if (this.hunger > 10) {
                                this.hunger = 10;
                                this.die();
                            }
                            break;
                        case 1:
                            this.sleepiness++;
                            if (this.sleepiness > 10) {
                                this.sleepiness = 10;
                                this.die();
                            }
                            break;
                        case 2:
                            this.boredom++;
                            if (this.boredom > 10) {
                                this.boredom = 10;
                                this.die();
                            }
                            break;
                    }
    
                    this.tilNextFill = this.secondsPerFill * 1000;
                }
            }
            else {
                this.tilNextDrain -= timing.deltaTime;
                if (this.tilNextDrain <= 0) {
                    this.sleepiness--;
                    if (this.sleepiness < 0) this.sleepiness = 0;
                    this.tilNextDrain = this.secondsPerDrain * 1000;
                }
            }
        }
    }

    birth() {

    }

    die() {
        this.state = "dead";
        this.$pets[this.spot].attr("src", this.pics.dead);
    }

    toggleFeeding() {
        if (this.state !== "dead") {
            if (this.state !== "feeding") {
                this.state = "feeding";
            }
            else this.state = "idle";
        }

        return this.hunger;
    }

    toggleSleeping() {
        if (this.state !== "dead") {
            if (this.state !== "sleeping") {
                this.state = "sleeping";
                this.$pets[this.spot].attr("src", this.pics.sleep);
            }
            else this.state = "idle";
        }

        return this.sleepiness;
    }

    toggleDancing() {
        if (this.state !== "dead") {
            if (this.state !== "dancing") {
                this.state = "dancing";
            }
            else this.state = "idle";
        }
        
        return this.boredom;
    }

    rename(name) {
        this.name = name;
    }

    moveRandomly() {
        this.clearDisplay();

        let chosen = Math.floor(Math.random() * 3);
        this.spot = chosen;
        this.$pets[chosen].attr("src", this.currentPic);
        this.$pets[chosen].css("display", "initial");
    }

    moveFeeding() {
        this.clearDisplay();

        this.spot = 2;
        this.$pets[2].attr("src", this.currentPic);
        this.$pets[2].css("display", "initial");
    }

    moveDancing() {
        this.clearDisplay();

        let chosen = Math.floor(Math.random() * 2);
        this.spot = chosen;
        this.$pets[chosen].attr("src", this.currentPic);
        this.$pets[chosen].css("display", "initial");
    }

    changePic() {
        if (Math.floor(Math.random() * 2) > 0) {
            switch (this.state) {
                case "sleeping":
                    this.currentPic = this.pics.sleep;
                    break;
                case "dancing":
                    this.currentPic = this.pics.stand;
                    break;
                case "feeding":
                    this.currentPic = this.pics.eat;
                    break;
            }
        }
        else this.currentPic = this.pics.idle;
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
        timing.update();

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

            this.$screen.addClass("bloom");
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

            this.$screen.addClass("bloom");
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