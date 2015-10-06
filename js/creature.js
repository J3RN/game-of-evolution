var CREATURE = {};
CREATURE.species = {};

var Creature = function(dna, loc) {
    if (!dna) {
        throw 'No DNA given!';
    }

    if (!loc) {
        throw 'No location given!';
    }

    this.dna = dna;
    this.size = dna[0];
    this.species = dna[1];
    this.color = dna.slice(2, 5);
    this.behavior = dna.slice(5, 9);
    this.speed = dna[10];

    this.loc = {
        x: loc[0],
        y: loc[1]
    };

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

    getBefore: function() {
        x = this.loc.x;
        y = this.loc.y;
        dir = this.direction;

        if ((dir === this.directions.up && y === 0) ||
                (dir === this.directions.left && x === 0) ||
                (dir === this.directions.down && y === 99) ||
                (dir === this.directions.right && x === 99)) {
            return this.entities.wall;
        } else {
            target = this.getCreatureBefore();

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

            switch(this.getBefore()) {
                case this.entities.friend:
                    this.friend_action();
                    break;
                case this.entities.enemy:
                    this.enemy_action();
                    break;
                case this.entities.empty:
                    this.empty_action();
                    break;
                case this.entities.wall:
                    this.wall_action();
                    break;
            }

            // if (this.days_since_food > 14) {
            //     this.die();
            // }
        }
    },

    friend_action: function() {
        switch(this.behavior[this.entities.friend]) {
            case 0:
                this.eat(this.getCreatureBefore());
                break;
            case 1:
                this.mate(this.getCreatureBefore());
                break;
            case 2:
                this.turn_left();
                break;
            case 3:
                this.turn_right();
                break;
        }
    },

    enemy_action: function() {
        switch(this.behavior[this.entities.enemy]) {
            case 0:
                this.eat(this.getCreatureBefore());
                break;
            case 1:
                this.mate(this.getCreatureBefore());
                break;
            case 2:
                this.turn_left();
                break;
            case 3:
                this.turn_right();
                break;
        }
    },

    empty_action: function() {
        switch(this.behavior[this.entities.empty]) {
            case 0:
                this.move();
                break;
            case 1:
                this.turn_left();
                break;
            case 2:
                this.turn_right();
                break;
        }
    },

    wall_action: function() {
        switch(this.behavior[this.entities.wall]) {
            case 0:
                this.turn_left();
                break;
            case 1:
                this.turn_right();
                break;
        }
    },

    eat: function(creature) {
        if (this.size < creature.size) {
            this.die();
        } else {
            creature.die();
            this.days_since_food = 0;
        }
    },

    mate: function(creature) {
        if (this.species === creature.species) {
            new_dna = mergeDNA(this, creature);

            CREATURE.creatures.push(new Creature(new_dna, this.loc));
        }
    },

    turn_right: function() {
        direction = this.direction + 1;
        if (direction === 4) {
            direction = 0;
        }
        this.direction = direction;
    },

    turn_left: function() {
        direction = this.direction - 1;
        if (direction === -1) {
            direction = 3;
        }
        this.direction = direction;
    },

    move: function() {
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
    },

    die: function() {
        console.log(this.dna);
        this.dead = true;
    }
}

function randomLocation() {
    return [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
}

function randomDirection() {
    return Math.floor(Math.random() * 4);
}

function randomColor() {
    return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ]
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

function createSpecies(species) {
    CREATURE.species[species] = randomColor();
}

function mergeDNA(species1, species2) {
    dna_length = species1.dna.length;
    new_dna = [];

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
    color = CREATURE.species[species];

    return [
        Math.ceil(Math.random() * 100),
        species,
        color[0],
        color[1],
        color[2],
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 2)
    ];
}
