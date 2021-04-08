class Pet {
    /**
     * @description Initializes your pets values and grabs relevant DOM elements
     */
    constructor() {
        this.food = 10;
        this.sleep = 10;
        this.fun = 10;
        this.secondsPerFill = 1;
        this.tilNextFill = this.secondsPerFill * 1000;
        this.secondsPerDrain = 10;
        this.tilNextDrain = this.secondsPerDrain * 1000;
        this.stage = 0;
        this.tilNextStage = [3, 5];
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
        this.bigPics = {
            idle: "img/big_idle.png",
            stand: "img/big_stand.png",
            sleep: "img/big_sleep.png",
            eat: "img/big_eat.png",
            dead: "img/big_dead.png"
        };
        this.currentPicSet = this.pics;
        this.currentPic = this.pics.egg;
    }

    /**
     * @description Must be called on every frame for your pet to be alive.
     */
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
                                this.tryToEvolve();
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

    /**
     * @description An egg will hatch when this function is invoked a sufficient number of times.
     */
    crackEgg() {
        this.tilNextStage[0]--;
        if (this.tilNextStage[0] <= 0) {
            this.tilNextStage[0] = 0;
            this.birth();
        }
    }
    
    /**
     * @description A mon will grow when this function is invoked a sufficient number of times.
     */
    tryToEvolve() {
        if (this.stage === 1){
            this.tilNextStage[1]--;
            if (this.tilNextStage[1] <= 0) {
                this.tilNextStage[1] = 0;
                this.stage++;
                this.currentPicSet = this.bigPics;
            }
        }
    }

    /**
     * @description Transform egg into mon.
     */
    birth() {
        this.stage = 1;
        this.currentPic = this.currentPicSet.idle;
    }

    /**
     * @description Your pet will die!
     */
    die() {
        this.state = "dead";
        this.$pets[this.spot].attr("src", this.currentPicSet.dead);
    }

    /**
     * @description Increases the input (by value) by one and caps it at 10;
     * @param {number} stat 
     * @returns stat
     */
    increaseStat(stat) {
        this.tilNextFill -= timing.deltaTime;
        if (this.tilNextFill <= 0) {
            stat++;
            if (stat > 10) stat = 10;
            this.tilNextFill = this.secondsPerFill * 1000;
        }

        return stat;
    }

    /**
     * @description Decreases the input (by value) by one and limits it to 0. May kill your pet.
     * @param {number} stat 
     * @returns stat
     */
    decreaseStat(stat) {
        stat--;
        if (stat <= 0) {
            stat = 0;
            this.die();
        }

        return stat;
    }

    /**
     * @description Toggle's your pet's feeding mode. Will toggle-off other modes.
     * @returns Your pet's food value.
     */
    toggleFeeding() {
        if (this.stage === 0) this.crackEgg();
        
        if (this.state !== "dead") {
            if (this.state !== "feeding") {
                this.state = "feeding";
            }
            else this.state = "idle";
        }

        return this.food;
    }

    /**
     * @description Toggle's your pet's sleeping mode. Will toggle-off other modes.
     * @returns Your pet's sleep value.
     */
    toggleSleeping() {
        if (this.stage === 0) this.crackEgg();
        
        if (this.state !== "dead") {
            if (this.state !== "sleeping") {
                this.state = "sleeping";
                if (this.stage > 0) this.$pets[this.spot].attr("src", this.currentPicSet.sleep);
            }
            else this.state = "idle";
        }

        return this.sleep;
    }

    /**
     * @description Toggle's your pet's dancing mode. Will toggle-off other modes.
     * @returns Your pet's fun value.
     */
    toggleDancing() {
        if (this.stage === 0) this.crackEgg();
        
        if (this.state !== "dead") {
            if (this.state !== "dancing") {
                this.state = "dancing";
            }
            else this.state = "idle";
        }
        
        return this.fun;
    }

    /**
     * @description Moves your pet to screen center.
     */
    moveEgg() {
        this.clearDisplay();

        this.spot = 1;
        this.$pets[this.spot].attr("src", this.currentPic);
        this.$pets[this.spot].css("display", "initial");
    }

    /**
     * @description Moves your pet to any spot.
     */
    moveRandomly() {
        this.clearDisplay();

        let chosen = Math.floor(Math.random() * 3);
        this.spot = chosen;
        this.$pets[chosen].attr("src", this.currentPic);
        this.$pets[chosen].css("display", "initial");
    }

    /**
     * @description Moves your pet to the right spot.
     */
    moveFeeding() {
        this.clearDisplay();

        this.spot = 2;
        this.$pets[this.spot].attr("src", this.currentPic);
        this.$pets[this.spot].css("display", "initial");
    }

    /**
     * @description Move your pet randomly between the left and center spots.
     */
    moveDancing() {
        this.clearDisplay();

        let chosen = Math.floor(Math.random() * 2);
        this.spot = chosen;
        this.$pets[chosen].attr("src", this.currentPic);
        this.$pets[chosen].css("display", "initial");
    }

    /**
     * @description Updates your pet's current sprite based on its current action.
     */
    changePic() {
        if (Math.floor(Math.random() * 2) > 0) {
            switch (this.state) {
                case "sleeping":
                    this.currentPic = this.currentPicSet.sleep;
                    break;
                case "dancing":
                    this.currentPic = this.currentPicSet.stand;
                    break;
                case "feeding":
                    this.currentPic = this.currentPicSet.eat;
                    break;
            }
        }
        else this.currentPic = this.currentPicSet.idle;
    }

    /**
     * @description No pet will show on screen.
     */
    clearDisplay() {
        for (let i = 0; i < 3; i++) {
            this.$pets[i].css("display", "none");
        }
    }

    /**
     * 
     * @returns Your pet's stats.
     */
    getStats() {
        return [this.food, this.sleep, this.fun];
    }
}

class Game {
    /**
     * @description Initializes the game's values, grabs relevant DOM elements and gives buttons listeners.
     */
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
    }

    /**
     * @description Call this every main game loop for the game to run.
     */
    update() {
        if (this.on) {
            this.updateClock();
            this.pet.update();
            this.updateStats();
        }
    }

    /**
     * @description Toggles power and updates the display accordingly.
     * @returns Current power state.
     */
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

    /**
     * @description Will turn on the game if off or initiate feeding mode. Will turn off other modes.
     */
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
    }

    /**
     * @description Will turn on the game if off or initiate sleeping mode. Will turn off other modes.
     */
    pressBlue() {
        if (!this.on) this.togglePower();
        else {
            this.pet.toggleSleeping();

            if (this.$food.css("display") !== "none") this.$food.css("display", "none");
            if (this.$music.css("display") !== "none") this.$music.css("display", "none");

            this.$screen.toggleClass("bloom");
        }
    }

    /**
     * @description Will turn on the game if off or initiate dancing mode. Will turn off other modes.
     */
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
    }

    /**
     * @description Invoke this at your desired frequency. This makes the clock match real life time.
     */
    updateClock() {
        let time = new Date();
        let rotation = ((time.getHours() % 12 / 12) + (time.getMinutes() / 60 / 12)) * 360;
        this.$hand.css("transform", `rotate(${rotation}deg)`);
    }

    /**
     * @description Invoke this if the game loses power.
     */
    resetClock() {
        this.$hand.css("transform", "rotate(0)");
    }

    /**
     * @description Updates the DOM status bars based on your pet's stats.
     */
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

//main game loop
setInterval(function() {
    timing.update();
    game.update();
}, 1000);