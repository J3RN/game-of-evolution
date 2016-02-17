'use strict';

class Game {
    constructor() {
        this.width = 100;
        this.height = 100;

        this.numIndiv = 5000;
        this.maxTurns = 0;
        this.turns = 0;
        this.game = 1;
        this.creatures = [];
        this.species = [];

        this.view =     new View(this.width, this.height);
        this.board =    new Board(this.view, this.width, this.height);

        this.interval = setInterval(this.gameLoop, 100);

        this.createInitialCreatures();
    }

    createInitialCreatures() {
        var numIndiv = this.numIndiv;

        for (var j = 0; j < numIndiv; j++) {
            var dna = DNA.generateDNA();
            var randomLoc = this.board.randomEmptyLocation();
            var newCreature = new Creature(dna, randomLoc);

            this.addCreature(newCreature);
        }

        redraw();
    }

    gameLoop() {
        for (var i = 0; i < this.creatures.length; i++) {
            var creature = this.creatures[i];

            if (creature) {
                creature.act();
            }
        }

        // Clear out 'undefined's
        this.creatures = this.creatures.filter(function(x) {
            return x !== undefined;
        })

        this.turns++;
        this.redraw();

        if (this.gameIsOver()) {
            this.resetGame();
        }
    }

    resetGame() {
        var i;

        this.board.clear();
        this.creatures = [];

        // Update max turns if necessary
        if (this.turns > this.maxTurns) {
            this.maxTurns = this.turns;
            this.view.updateMaxTurnsCount(this.maxTurns);
        }

        this.game++;
        this.view.updateGameCount(this.game);

        // Create new creatures, restart game timer
        this.createInitialCreatures();
        this.turns = 0;
    }

    getAliveCount() {
        return this.creatures.filter(function(x) {
            return !x.dead;
        }).length;
    }

    getAvgSize() {
        var totalSize = this.creatures.reduce(function(acc, item) {
            return acc + item.size;
        }, 0);
        return totalSize / this.creatures.length;
    }

    topXSpecies(x) {
        return this.nonDeadSpecies().sort(function(a, b) {
            return this.species[b] - this.species[a];
        }).slice(0, x);
    }

    nonDeadSpecies() {
        return Object.keys(this.species).filter(function(name) {
            return this.species[name] && this.species[name] !== 0;
        });
    }

    redraw() {
        this.view.updateTurnCount(this.turns);

        var total = this.creatures.length;
        var alive = this.getAliveCount();
        var dead = total - alive;

        this.view.updateCreatureCount(total);
        this.view.updateAliveCount(alive);
        this.view.updateDeadCount(dead);

        this.view.updateAvgSizeIndicator(this.getAvgSize());
        this.view.updateTopSpeciesList(topXSpecies(5));

        this.board.redraw();
    }

    gameIsOver() {
        if (getAliveCount() === 0) {
            return true;
        }

        return false;
    }

    addCreature(newCreature) {
        this.creatures.push(newCreature);
        this.board.addCreature(newCreature);
    }

    removeCreature(creature) {
        if (!creature.dead) {
            this.species[creature.color]--;
        }

        delete this.creatures[this.creatures.indexOf(creature)];
        this.board.removeCreature(creature.loc);
    }
};
