'use strict';

var CREATURE = {
    max_lifespan: 100,
    max_time_without_food: 25,

    randomDirection: function() {
        return Math.floor(Math.random() * 4);
    },

    spawnLocation: function(creature) {
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
            if (GAME.getItem(loc.x, loc.y) || GAME.isOutOfBounds(loc)) {
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
    this.species = dna[0];
    this.color = SPECIES.species[this.species];
    this.size = dna[1];
    this.behavior = dna.slice(2, 6);
    this.speed = dna[6];

    this.loc = loc;
    this.age = 0;
    this.direction = CREATURE.randomDirection();
    this.food = 0;
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
                return GAME.getItem(this.loc.x, this.loc.y - 1);
                break;
            case this.directions.right:
                return GAME.getItem(this.loc.x + 1, this.loc.y);
                break;
            case this.directions.down:
                return GAME.getItem(this.loc.x, this.loc.y + 1);
                break;
            case this.directions.left:
                return GAME.getItem(this.loc.x - 1, this.loc.y);
                break;
        }
    },

    act: function() {
        if (!this.dead) {
            this.age += 1;

            // Decrease food every 10 turns
            if (this.age % 20 === 0) {
                this.food--;
            }

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

            if (this.age > CREATURE.max_lifespan || this.food < 0) {
                this.die();
            }
        }
    },

    eat: function() {
        var creature = this.getCreatureBefore();

        if (creature && (creature.dead || this.size > creature.size)) {
            // Remove creature
            delete GAME.board[creature.loc.x][creature.loc.y];
            delete GAME.creatures[GAME.creatures.indexOf(creature)];

            this.food++;
        }
    },

    mate: function() {
        var creature = this.getCreatureBefore();

        if (creature && this.species === creature.species) {
            var childLocation = CREATURE.spawnLocation(this) || CREATURE.spawnLocation(creature);
            var new_dna = DNA.mergeDNA(this, creature);

            if (childLocation) {
                var child = new Creature(new_dna, childLocation);

                GAME.board[childLocation.x][childLocation.y] = child;
                GAME.creatures.push(child);
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
            GAME.moveItem(oldLoc, newLoc);
        }
    },

    die: function() {
        this.dead = true;
    },
}
