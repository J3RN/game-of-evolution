'use strict';

var CREATURE = {
    maxLifespan: 100,
    maxTimeWithoutFood: 25,

    randomDirection: function() {
        return Math.floor(Math.random() * 4);
    },

    spawnLocation: function(creature) {
        var xs = [creature.loc.x - 1, creature.loc.x + 1];
        var ys = [creature.loc.y - 1, creature.loc.y + 1];

        var y = creature.loc.y;
        var x = creature.loc.x;

        var possibleLocs = [];
        ys.forEach(function(newY) {
            possibleLocs.push({ x: x, y: newY });
        });
        xs.forEach(function(newX) {
            possibleLocs.push({ x: newX, y: y });
        });

        var locs = possibleLocs.filter(function(loc) {
            if (GAME.board.getItem(loc) || GAME.board.isOutOfBounds(loc)) {
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
    },
}


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
    this.color = DNA.computeColor(this.dna);
    this.size = dna[0];
    this.behavior = dna.slice(1, 7);

    this.loc = loc;
    this.age = 0;
    this.direction = CREATURE.randomDirection();
    this.food = 0;
    this.dead = false;

    // Update GAME.species counts
    if (GAME.species[this.color] === undefined) {
        GAME.species[this.color] = 1;
    } else {
        GAME.species[this.color] += 1;
    }
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
        wall: 3,
        deadFriend: 4,
        deadEnemy: 5,
    },

    actions: [
        "eat",
        "mate",
        "turnLeft",
        "turnRight",
        "move",
        "turnAround",
    ],

    getBefore: function() {
        var x = this.loc.x;
        var y = this.loc.y;

        var dir = this.direction;

        if ((dir === this.directions.up && y === 0) ||
                (dir === this.directions.left && x === 0) ||
                (dir === this.directions.down && y === GAME.board.height - 1) ||
                (dir === this.directions.right && x === GAME.board.width - 1)) {
            return this.entities.wall;
        } else {
            var target = this.getCreatureBefore();

            if (target) {
                if (DNA.sameDNA(target.dna, this.dna)) {
                    if (target.dead) {
                        return this.entities.deadFriend;
                    } else {
                        return this.entities.friend;
                    }
                } else {
                    if (target.dead) {
                        return this.entities.deadEnemy;
                    } else {
                        return this.entities.enemy;
                    }
                }
            } else {
                return this.entities.empty;
            }
        }
    },

    getCreatureBefore: function() {
        switch(this.direction) {
            case this.directions.up:
                return GAME.board.getItem({x: this.loc.x, y: this.loc.y - 1});
                break;
            case this.directions.right:
                return GAME.board.getItem({x: this.loc.x + 1, y: this.loc.y});
                break;
            case this.directions.down:
                return GAME.board.getItem({x: this.loc.x, y: this.loc.y + 1});
                break;
            case this.directions.left:
                return GAME.board.getItem({x: this.loc.x - 1, y: this.loc.y});
                break;
        }
    },

    act: function() {
        if (!this.dead) {
            this.age += 1;

            var behavior = this.behavior[this.getBefore()];
            var action = this.actions[behavior];
            this[action]();

            // No food or too old? Die
            if ((this.age % CREATURE.maxTimeWithoutFood === 0 && this.food === 0) ||
                    this.age > CREATURE.maxLifespan) {
                this.die();
            }
        }
    },

    eat: function() {
        var creature = this.getCreatureBefore();

        if (creature && (creature.dead || this.size > creature.size)) {
            GAME.removeCreature(creature);
            this.food += creature.food + 1;
        }
    },

    mate: function() {
        if (this.age > 0 && this.food > 1) {
            var childLocation = CREATURE.spawnLocation(this);

            if (childLocation) {
                var newDna = DNA.copyDNA(this.dna);
                var child = new Creature(newDna, childLocation);

                // Subtract one for new creature
                this.food--;

                // Split food evenly among parent and child,
                // remainder goes to child
                var rem = this.food % 2;
                child.food = Math.floor(this.food / 2) + rem;
                this.food = Math.floor(this.food / 2);

                GAME.addCreature(child);
            }
        }
    },

    turnRight: function() {
        var direction = this.direction + 1;
        if (direction === 4) {
            direction = 0;
        }
        this.direction = direction;
    },

    turnLeft: function() {
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

            GAME.board.moveCreature(this, oldLoc, newLoc);
        }
    },

    turnAround: function() {
        var newDirection = this.direction - 2;
        if (newDirection < 0) {
            newDirection += 4;
        }
        this.direction = newDirection;
    },

    die: function() {
        this.dead = true;

        // This needs to be moved
        GAME.species[this.color] -= 1;
        GAME.board.changed.push(this.loc);
    },
}
