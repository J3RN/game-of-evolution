function setup() {
    // Setup items here
    createInitial();
}

function createInitial() {
    CREATURE.creatures = [];

    for (var i = 0; i < 200; i++) {
        CREATURE.creatures.push(new Creature(1));
    }

    redraw();
}

function gameLoop() {
    // Prune off the dead
    CREATURE.creatures.forEach(function(creature, index) {
        if (creature.dead) {
            delete CREATURE.creatures[index];
        }
    });

    // Remaining creatures act
    CREATURE.creatures.forEach(function(creature, index) {
        creature.act();
    });

    redraw();
}

function redraw() {
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            creature = getCreature(x, y);

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
