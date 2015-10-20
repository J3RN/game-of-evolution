'use strict';

var GAME = {
    num_species: 10,
    num_indiv: 500,
    max_turns: 0,
    turns: 0,
    creatures: [],

    setup: function() {
        GAME.createBoard();
        GAME.createInitialCreatures();
    },

    createBoard: function() {
        GAME.board = [];

        for (var i = 0; i < 100; i++) {
            GAME.board[i] = [];

            for (var j = 0; j < 100; j++) {
                GAME.board[i][j] = undefined;
            }
        }
    },

    createInitialCreatures: function() {
        var num_species = GAME.num_species;
        var num_indiv = GAME.num_indiv;

        for (var i = 0; i < num_species; i++) {
            SPECIES.species[i] = SPECIES.createSpecies(i);

            for (var j = 0; j < (num_indiv / num_species); j++) {
                var dna = DNA.generateDNA(i);
                var randomLoc = GAME.randomLocation();

                while (GAME.getItem(randomLoc.x, randomLoc.y)) {
                    randomLoc = GAME.randomLocation();
                }

                var newCreature = new Creature(dna, randomLoc);

                GAME.creatures.push(newCreature);
                GAME.board[randomLoc.x][randomLoc.y] = newCreature;
            }
        }

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

        document.getElementById("game-turn").textContent = "Turn: " + GAME.turns;

        if (GAME.gameIsOver()) {
            GAME.resetGame();
        }
    },

    resetGame: function() {
        var i;

        // Delete all remaining creatures
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                if (GAME.board[x][y]) {
                    delete GAME.board[x][y];
                }
            }
        }

        // Delete all remaining creatures?
        for (i = 0; i < GAME.creatures.length; i++) {
            delete GAME.creatures[i];
        }

        GAME.creatures = [];

        // Delete all species
        for (i = 0; i < SPECIES.species.length; i++) {
            delete SPECIES.species[i];
        }

        SPECIES.species = [];

        // Update max turns if necessary
        if (GAME.turns > GAME.max_turns) {
            GAME.max_turns = GAME.turns;
            document.getElementById("max-time").textContent = "Max turns: " + GAME.max_turns;
        }

        // Create new creatures, restart game timer
        GAME.createInitialCreatures();
        GAME.turns = 0;
    },

    redraw: function() {
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                var creature = GAME.getItem(x, y);

                if (creature) {
                    if (creature.dead) {
                        ADAPTER.setCell(x, y, [0, 0, 0]);
                    } else {
                        ADAPTER.setCell(x, y, creature.color);
                    }
                } else {
                    ADAPTER.setCell(x, y, [255, 255, 255]);
                }
            }
        }
    },

    gameIsOver: function() {
        var allDead = true;
        var allEmpty = true;

        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                var item = GAME.getItem(x, y)

                if (item) {
                    allEmpty = false;

                    if (!item.dead) {
                        allDead = false;
                    }
                }
            }
        }

        return allDead || allEmpty;
    },

    randomLocation: function() {
        return {
            x: Math.floor(Math.random() * 100),
            y: Math.floor(Math.random() * 100)
        };
    },

    isOutOfBounds: function(loc) {
        if (loc.x < 0 || loc.x > 99 || loc.y < 0 || loc.y > 99) {
            return true;
        } else {
            return false;
        }
    },

    getItem: function(x, y) {
        if (GAME.isOutOfBounds({ x: x, y: y })) {
            return undefined;
        } else {
            return GAME.board[x][y];
        }
    },

    moveItem: function(oldLoc, newLoc) {
        GAME.board[newLoc.x][newLoc.y] = GAME.getItem(oldLoc.x, oldLoc.y);
        GAME.board[oldLoc.x][oldLoc.y] = undefined;
    },

};


(function() {
    function load() {
        if (document.readyState === 'loading') {
            setTimeout(load, 100);
        } else {
            var reset = document.getElementById("reset");
            reset.onclick = GAME.resetGame;
            ADAPTER.load();
            GAME.setup();
            setInterval(GAME.gameLoop, 100);
        }
    }

    load();
})();
