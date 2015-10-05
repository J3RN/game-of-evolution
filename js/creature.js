var CREATURE = {};

var Creature = function(dna) {
    // this.behavior = dna.behavior;
    // this.size = dna.size;

    randomLoc = randomLocation();
    this.loc = {
        x: randomLoc[0],
        y: randomLoc[1]
    };
    this.direction = randomDirection();
    this.color = randomColor();
    this.days_since_food = 0;
    this.dead = false;
}

Creature.prototype = {
    act: function() {

    }
}

function randomLocation() {
    return [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
}

function randomDirection() {
    return Math.floor(Math.random() * 4);
}

function randomColor() {
    return [ Math.floor(Math.random() * 256),
             Math.floor(Math.random() * 256),
             Math.floor(Math.random() * 256) ]
}

function getCreature(x, y) {
    return CREATURE.creatures.reduce(function(prev, creature) {
        if (creature.loc.x === x && creature.loc.y === y) {
            return creature;
        } else {
            return prev;
        }
    }, undefined);
}
