class Pet {
    constructor() {
        this.name = "";
        this.age = 0;
        this.food = 10;
        this.sleep = 10;
        this.fun = 10;
        this.secondsPerFill = 1;
        this.tilNextFill = this.secondsPerFill * 1000;
        this.secondsPerDrain = 10;
        this.tilNextDrain = this.secondsPerDrain * 1000;
        this.stage = 0;
        this.tilNextStage = [3, 10];
        this.state = "idle";
        this.$pets = [$("#p0"), $("#p1"), $("#p2")];
        this.spot = 0;
        this.pics = {
            egg: "img/egg.png",
            idle: "img/mon_base.png",
            stand: "img/mon_stand.png",
            sleep: "img/mon_sleep.png",
            eat: "img/mon_eat.png",
            dead: "img/mon_dead.png"
        };
        this.currentPic = this.pics.egg;
    }

    update() {
        if (this.state !== "dead") {
            if (this.stage > 0) {
                this.changePic();
                
                if (this.state !== "sleeping") {
                    if (this.state === "idle") this.moveRandomly();
                    if (this.state === "feeding") {
                        this.moveFeeding();
        
                        this.food = this.increaseStat(this.food);
                    }
                    if (this.state === "dancing") {
                        this.moveDancing();
        
                        this.fun = this.increaseStat(this.fun);
                    }
        
                    this.tilNextDrain -= timing.deltaTime;
                    if (this.tilNextDrain <= 0) {
                        switch (Math.floor(Math.random() * 3)) {
                            case 0:
                                this.food = this.decreaseStat(this.food);
                                break;
                            case 1:
                                this.sleep = this.decreaseStat(this.sleep);
                                break;
                            case 2:
                                this.fun = this.decreaseStat(this.fun);
                                break;
                        }
        
                        this.tilNextDrain = this.secondsPerDrain * 1000;
                    }
                }
                else {
                    this.sleep = this.increaseStat(this.sleep);
                }
            }
            else this.moveEgg();
        }
    }

    crackEgg() {
        this.tilNextStage[0]--;
        if (this.tilNextStage[0] <= 0) {
            this.tilNextStage[0] = 0;
            this.birth();
        }
    }

    birth() {
        this.stage = 1;
        this.currentPic = this.pics.idle;
    }

    die() {
        this.state = "dead";
        this.$pets[this.spot].attr("src", this.pics.dead);
    }

    increaseStat(stat) {
        this.tilNextFill -= timing.deltaTime;
        if (this.tilNextFill <= 0) {
            stat++;
            if (stat > 10) stat = 10;
            this.tilNextFill = this.secondsPerFill * 1000;
        }

        return stat;
    }

    decreaseStat(stat) {
        stat--;
        if (stat <= 0) {
            stat = 0;
            this.die();
        }

        return stat;
    }

    toggleFeeding() {
        if (this.stage === 0) this.crackEgg();
        
        if (this.state !== "dead") {
            if (this.state !== "feeding") {
                this.state = "feeding";
            }
            else this.state = "idle";
        }

        return this.hunger;
    }

    toggleSleeping() {
        if (this.stage === 0) this.crackEgg();
        
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
        if (this.stage === 0) this.crackEgg();
        
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

    moveEgg() {
        this.clearDisplay();

        this.spot = 1;
        this.$pets[this.spot].attr("src", this.currentPic);
        this.$pets[this.spot].css("display", "initial");
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
        this.$pets[this.spot].attr("src", this.currentPic);
        this.$pets[this.spot].css("display", "initial");
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
        return [this.food, this.sleep, this.fun];
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