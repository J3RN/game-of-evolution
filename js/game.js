'use strict';

var GAME = {
    num_indiv: 5000,
    max_turns: 0,
    turns: 0,
    creatures: [],
    species: [],

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
        var num_indiv = GAME.num_indiv;

        for (var j = 0; j < num_indiv; j++) {
            var dna = DNA.generateDNA();
            var randomLoc = GAME.randomLocation();

            while (GAME.getItem(randomLoc.x, randomLoc.y)) {
                randomLoc = GAME.randomLocation();
            }

            var newCreature = new Creature(dna, randomLoc);

            GAME.creatures.push(newCreature);
            GAME.board[randomLoc.x][randomLoc.y] = newCreature;
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
        document.getElementById("game-turn").textContent = "Turn: " + GAME.turns;

        var total = GAME.creatures.length;
        var alive = GAME.creatures.filter(function(x) {
            return !x.dead;
        }).length;
        document.getElementById("creature-count").textContent = total;
        document.getElementById("alive").textContent = alive;
        document.getElementById("dead").textContent = total - alive;

        var avg_size = GAME.creatures.reduce(function(acc, item) {
            return acc + item.size;
        }, 0) / GAME.creatures.length;

        document.getElementById("avg-size").textContent = "Average Size: " + avg_size.toFixed(2);

        var topSpecies = GAME.topXSpecies(5);
        for (var x = 1; x < 6; x++) {
            var color = topSpecies[x - 1];

            document.getElementById("top" + x + "color").textContent = color;

            if (color) {
                document.getElementById("top" + x + "color").style.color = "hsl(" + color + ", 100%, 50%)";
            } else {
                document.getElementById("top" + x + "color").style.color = "none";
            }

            document.getElementById("top" + x + "count").textContent = GAME.species[color];
        }

        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                var creature = GAME.getItem(x, y);

                if (creature) {
                    if (creature.dead) {
                        ADAPTER.setCell(x, y, [creature.color, "75%", "30%"]);
                    } else {
                        ADAPTER.setCell(x, y, [creature.color, "100%", "50%"]);
                    }
                } else {
                    ADAPTER.setCell(x, y, [0, "100%", "100%"]);
                }
            }
        }
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
