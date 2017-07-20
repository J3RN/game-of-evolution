'use strict';

var GAME = {
    numFood: 5000,
    max_turns: 0,
    turns: 0,
    game: 1,
    creatures: [],
    species: [],
    domAdapter: undefined,  // loaded in setup
    canvasAdapter: undefined,

    setup: function() {
        this.board =            new Board();
        this.domAdapter =       new DomAdapter();

        GAME.createInitialCreature();
    },

    createInitialCreature: function() {
        var fakeDNA = new Array(DNA.length);

        // numBehavior is out-of-bounds for normal DNA. This DNA is guaranteed
        // not to match any naturally birthed creature.
        for (var i = 0; i < DNA.length; i++) {
            fakeDNA[i] = DNA.numBehavior;
        }

        // Generate fake, dead creatures
        for (var j = 0; j < this.numFood; j++) {
            var randomLoc = this.board.randomEmptyLocation();
            var newCreature = new Creature(fakeDNA, randomLoc);
            newCreature.dead = true;

            this.board.addCreature(newCreature);
        }

        // Generate real creature
        var dna = DNA.generateDNA();
        var randomLoc = this.board.randomEmptyLocation();
        var newCreature = new Creature(dna, randomLoc);

        this.addCreature(newCreature);

	GAME.redraw();
    },

    gameLoop: function() {
        for (var i = 0; i < GAME.creatures.length; i++) {
            var creature = GAME.creatures[i];

            if (creature) {
                creature.act();
            }
        }

        // Clear out 'undefined's
        GAME.creatures = GAME.creatures.filter(function(x) {
            return x !== undefined;
        })

        GAME.turns++;
        GAME.redraw();

        if (GAME.gameIsOver()) {
            GAME.resetGame();
        }
    },

    resetGame: function() {
        var i;

        GAME.board.clear();
        GAME.creatures = [];

        // Update max turns if necessary
        if (GAME.turns > GAME.maxTurns) {
            GAME.maxTurns = GAME.turns;
            this.domAdapter.updateMaxTurnsCount(GAME.maxTurns);
        }

        GAME.game++;
        this.domAdapter.updateGameCount(GAME.game);

        // Create new creatures, restart game timer
        GAME.createInitialCreature();
        GAME.turns = 0;
    },

    getAliveCount: function() {
        return GAME.creatures.filter(function(x) {
            return !x.dead;
        }).length;
    },

    getAvgSize: function() {
        var totalSize = GAME.creatures.reduce(function(acc, item) {
            return acc + item.size;
        }, 0);
        return totalSize / GAME.creatures.length;
    },

    topXSpecies: function(x) {
        return GAME.nonDeadSpecies().sort(function(a, b) {
            return GAME.species[b] - GAME.species[a];
        }).slice(0, x);
    },

    nonDeadSpecies: function() {
        return Object.keys(GAME.species).filter(function(name) {
            return GAME.species[name] && GAME.species[name] !== 0;
        });
    },

    redraw: function() {
        this.domAdapter.updateTurnCount(GAME.turns);

        var total = GAME.creatures.length;
        var alive = GAME.getAliveCount();
        var dead = total - alive;

        this.domAdapter.updateCreatureCount(total);
        this.domAdapter.updateAliveCount(alive);
        this.domAdapter.updateDeadCount(dead);

        this.domAdapter.updateAvgSizeIndicator(this.getAvgSize());
        this.domAdapter.updateTopSpeciesList(GAME.topXSpecies(5));

        this.board.redraw();
    },

    gameIsOver: function() {
        if (GAME.getAliveCount() === 0) {
            return true;
        }

        return false;
    },

    addCreature: function(newCreature) {
        this.creatures.push(newCreature);
        this.board.addCreature(newCreature);

        // Update GAME.species count
        if (GAME.species[newCreature.color] === undefined) {
            GAME.species[newCreature.color] = 1;
        } else {
            GAME.species[newCreature.color] += 1;
        }
    },

    removeCreature: function(creature) {
        if (!creature.dead) {
            this.species[creature.color]--;
        }

        delete this.creatures[this.creatures.indexOf(creature)];
        this.board.removeCreature(creature.loc);
    }
};


(function() {
    function load() {
        if (document.readyState === 'loading') {
            setTimeout(load, 100);
        } else {
            var reset = document.getElementById("reset");
            reset.onclick = GAME.resetGame;
            GAME.setup();
            setInterval(GAME.gameLoop, 10);
        }
    }

    load();
})();
