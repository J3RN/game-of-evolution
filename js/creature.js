'use strict';

var GAME = {};

var Creature = function(dna, loc) {
    if (dna === undefined) {
        throw 'No DNA given!';
    }

    if (loc === undefined) {
        throw 'No location given!';
    } else if (loc.x === undefined) {
        throw 'No x coordinate!'
    } else if (loc.y === undefined) {
        throw 'No y coordinate!';
    }

    this.dna = dna;
    this.species = dna[0];
    this.color = GAME.species[this.species];
    this.size = dna[1];
    this.behavior = dna.slice(2, 6);
    this.speed = dna[6];

    this.loc = loc;
    this.direction = randomDirection();
    this.days_since_food = 0;
    this.dead = false;
}

Creature.prototype = {
    directions: {
        up: 0,
        right: 1,
        down: 2,
        left: 3
    },

    entities: {
        enemy: 0,
        friend: 1,
        empty: 2,
        wall: 3
    },

    actions: {
        eat: 0,
        mate: 1,
        turn_left: 2,
            turn_right: 3,
            move: 4
    },

    getBefore: function() {
        var x = this.loc.x;
        var y = this.loc.y;

        var dir = this.direction;

        if ((dir === this.directions.up && y === 0) ||
                (dir === this.directions.left && x === 0) ||
                (dir === this.directions.down && y === 99) ||
                (dir === this.directions.right && x === 99)) {
            return this.entities.wall;
        } else {
            var target = this.getCreatureBefore();

            if (target) {
                if (target.species === this.species) {
                    return this.entities.friend;
                } else {
                    return this.entities.enemy;
                }
            } else {
                return this.entities.empty;
            }
        }
    },

    getCreatureBefore: function() {
        switch(this.direction) {
            case this.directions.up:
                return getCreature(this.loc.x, this.loc.y - 1);
                break;
            case this.directions.right:
                return getCreature(this.loc.x + 1, this.loc.y);
                break;
            case this.directions.down:
                return getCreature(this.loc.x, this.loc.y + 1);
                break;
            case this.directions.left:
                return getCreature(this.loc.x - 1, this.loc.y);
                break;
        }
    },

    act: function() {
        if (!this.dead) {
            this.days_since_food += 1;

            var behavior = this.behavior[this.getBefore()];
            switch(behavior) {
                case this.actions.eat:
                    this.eat();
                    break;
                case this.actions.mate:
                    this.mate();
                    break;
                case this.actions.turn_left:
                    this.turn_left();
                    break;
                case this.actions.turn_right:
                    this.turn_right();
                    break;
                case this.actions.move:
                    this.move();
                    break;
            }

            // Starvation
            if (this.days_since_food > 14) {
                this.die();
            }
        }
    },

    eat: function() {
        var creature = this.getCreatureBefore();

        if (creature && this.size > creature.size) {
            creature.die();
            this.days_since_food = 0;
        }
    },

    mate: function() {
        var creature = this.getCreatureBefore();

        if (creature && this.species === creature.species) {
            var childLocation = newLocation(this) || newLocation(creature);
            var new_dna = mergeDNA(this, creature);

            if (childLocation) {
                GAME.board[childLocation.x][childLocation.y] = new Creature(new_dna, childLocation);
            }
        }
    },

    turn_right: function() {
        var direction = this.direction + 1;
        if (direction === 4) {
            direction = 0;
        }
        this.direction = direction;
    },

    turn_left: function() {
        var direction = this.direction - 1;
        if (direction === -1) {
            direction = 3;
        }
        this.direction = direction;
    },

    move: function() {
        var before = this.getBefore();

        if (before === this.entities.empty) {
            var oldLoc = { x: this.loc.x, y: this.loc.y };

            switch(this.direction) {
                case this.directions.up:
                    this.loc.y -= 1;
                    break;
                case this.directions.right:
                    this.loc.x += 1;
                    break;
                case this.directions.down:
                    this.loc.y += 1;
                    break;
                case this.directions.left:
                    this.loc.x -= 1;
                    break;
            }

            var newLoc = { x: this.loc.x, y: this.loc.y };
            moveCreature(oldLoc, newLoc);
        }
    },

    die: function() {
        GAME.board[this.loc.x][this.loc.y] = undefined;
        delete this;
    }
}

function randomLocation() {
    return {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
    };
}

function randomDirection() {
    return Math.floor(Math.random() * 4);
}

function randomBehavior() {
    return Math.floor(Math.random() * 5);
}

function randomUint8() {
    return Math.floor(Math.random() * 256);
}

function randomColor() {
    return [
        randomUint8(),
        randomUint8(),
        randomUint8()
    ]
}

function getCreature(x, y) {
    if (x > 99 || x < 0 || y > 99 || y < 0) {
        return undefined;
    } else {
        return GAME.board[x][y];
    }
}

function createSpecies(species) {
    GAME.species[species] = randomColor();
}

function mergeDNA(species1, species2) {
    var dna_length = species1.dna.length;
    var new_dna = [];

    for (var i = 0; i < dna_length; i++) {
        if (Math.random() > 0.5) {
            new_dna.push(species1.dna[i]);
        } else {
            new_dna.push(species2.dna[i]);
        }
    }

    return new_dna;
}


function generateDNA(species) {
    return [
        species,
        Math.ceil(Math.random() * 10),
        randomBehavior(),
        randomBehavior(),
        randomBehavior(),
        randomBehavior(),
        0,
    ];
}

function moveCreature(oldLoc, newLoc) {
    GAME.board[newLoc.x][newLoc.y] = getCreature(oldLoc.x, oldLoc.y);
    GAME.board[oldLoc.x][oldLoc.y] = undefined;
}

function newLocation(creature) {
    // Only spawn left an right
    var dir = creature.direction;

    var possibleLocs = [];

    if (dir === creature.directions.up || dir === creature.directions.down) {
        var xs = [creature.loc.x - 1, creature.loc.x + 1];
        var y = creature.loc.y;

        xs.forEach(function(x) {
            possibleLocs.push({ x: x, y: y });
        });
    } else {
        var ys = [creature.loc.y - 1, creature.loc.y + 1];
        var x = creature.loc.x;

        ys.forEach(function(y) {
            possibleLocs.push({ x: x, y: y });
        });
    }

    var locs = possibleLocs.filter(function(loc) {
        if (getCreature(loc.x, loc.y) || isOutOfBounds(loc)) {
            return false;
        } else {
            return true;
        }
    });

    if (locs.length === 0) {
        return undefined;
    }

    var randIndex = Math.floor(Math.random() * locs.length);
    return locs[randIndex];
}

function isOutOfBounds(loc) {
    if (loc.x < 0 || loc.x > 99 || loc.y < 0 || loc.y > 99) {
        return true;
    } else {
        return false;
    }
}
