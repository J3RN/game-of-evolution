GAME.num_species = 4;

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

    for (var i = 0; i < num_species; i++) {
        createSpecies(i);

        for (var j = 0; j < (200 / num_species); j++) {
            var dna = generateDNA(i);

            do {
                var randomLoc = randomLocation();
            } while (getCreature(randomLoc.x, randomLoc.y));

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
