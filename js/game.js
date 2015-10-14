'use strict';

GAME.num_species = 20;
GAME.num_indiv = 600;
GAME.max_time = 30000;

function setup() {
    createBoard();
    createInitialCreatures();
}

function createBoard() {
    GAME.board = [];

    for (var i = 0; i < 100; i++) {
        GAME.board[i] = [];

        for (var j = 0; j < 100; j++) {
            GAME.board[i][j] = undefined;
        }
    }
}

function createInitialCreatures() {
    var num_species = GAME.num_species;
    var num_indiv = GAME.num_indiv;
    GAME.species = {};
    GAME.start_time = Date.now();

    for (var i = 0; i < num_species; i++) {
        createSpecies(i);

        for (var j = 0; j < (num_indiv / num_species); j++) {
            var dna = generateDNA(i);
            var randomLoc = randomLocation();

            while (getCreature(randomLoc.x, randomLoc.y)) {
                randomLoc = randomLocation();
            }

            var newCreature = new Creature(dna, randomLoc);

            GAME.board[randomLoc.x][randomLoc.y] = newCreature;
        }
    }

    redraw();
}

function gameLoop() {
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            var creature = getCreature(x, y);

            if (creature) {
                creature.act();
            }
        }
    }

    if (gameIsOver()) {
        delete GAME.species;

        // Delete all remaining creatures
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                if (GAME.board[x][y]) {
                    delete GAME.board[x][y];
                }
            }
        }

        createInitialCreatures();
    }

    redraw();
}

function redraw() {
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            var creature = getCreature(x, y);

            if (creature) {
                setCell(x, y, creature.color);
            } else {
                setCell(x, y, [255, 255, 255]);
            }
        }
    }
}

function gameIsOver() {
    if ((Date.now() - GAME.start_time) > GAME.max_time) {
        return true;
    }

    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            if (getCreature(x, y)) return false;
        }
    }

    return true;
}

(function() {
    function load() {
        if (document.readyState === 'loading') {
            setTimeout(load, 100);
        } else {
            setup();
            setInterval(gameLoop, 100);
        }
    }

    load();
})();
