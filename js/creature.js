'use strict';

function createNoise(freq) {
    var rate = 44100;  // Sample rate (samples per second)
    var data = [];

    for (var i = 0; i < 250; i++) {
        var time = i / rate;
        data[i] = 128 + Math.round(127 * (Math.sin(2 * Math.PI * freq * time)));
    }

    var wave = new RIFFWAVE(data);
    return new Audio(wave.dataURI);
}

function createEatNoise() {
    return createNoise(2000);
}

function createReproduceNoise() {
    return createNoise(3000);
}

var CREATURE = {
    max_lifespan: 100,
    max_time_without_food: 25,

    eatNoise: createEatNoise(),

    reproduceNoise: createReproduceNoise(),

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
        dead_friend: 4,
        dead_enemy: 5,
    },

    actions: {
        eat: 0,
        mate: 1,
        turn_left: 2,
        turn_right: 3,
        move: 4,
        turn_around: 5,
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
                if (DNA.sameDNA(target.dna, this.dna)) {
                    if (target.dead) {
                        return this.entities.dead_friend;
                    } else {
                        return this.entities.friend;
                    }
                } else {
                    if (target.dead) {
                        return this.entities.dead_enemy;
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
                case this.actions.turn_around:
                    this.turn_around();
                    break;
            }

            // No food or too old? Die
            if ((this.age % CREATURE.max_time_without_food === 0 && this.food === 0) ||
                    this.age > CREATURE.max_lifespan) {
                this.die();
            }
        }
    },

    eat: function() {
        var creature = this.getCreatureBefore();

        if (creature && (creature.dead || this.size > creature.size)) {
            // Remove creature
            if (!creature.dead) {
                GAME.species[creature.color]--;
            }

            delete GAME.board[creature.loc.x][creature.loc.y];
            delete GAME.creatures[GAME.creatures.indexOf(creature)];

            this.food += creature.food + 1;

            // Play appropriate noise
            CREATURE.eatNoise.play();
        }
    },

    mate: function() {
        if (this.age > 0 && this.food > 1) {
            var childLocation = CREATURE.spawnLocation(this);

            if (childLocation) {
                var new_dna = DNA.copyDNA(this.dna);
                var child = new Creature(new_dna, childLocation);

                // Subtract one for new creature
                this.food--;

                // Split food evenly among parent and child
                var rem = this.food % 2;
                child.food = Math.floor(this.food / 2) + rem;
                this.food = Math.floor(this.food / 2);

                GAME.board[childLocation.x][childLocation.y] = child;
                GAME.creatures.push(child);

                CREATURE.reproduceNoise.play();
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

    turn_around: function() {
        var newDirection = this.direction - 2;
        if (newDirection < 0) {
            newDirection += 4;
        }
        this.direction = newDirection;
    },

    die: function() {
        this.dead = true;
        GAME.species[this.color] -= 1;
    },
}
