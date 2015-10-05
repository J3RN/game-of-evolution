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
    directions: {
        up: 0,
        right: 1,
        down: 2,
        left: 3
    },

    entities: {
        enemy: 0,
        friend: 1,
        wall: 2,
        empty: 3
    },

    getBefore: function() {
        x = this.loc.x;
        y = this.loc.y;
        dir = this.direction;

        if ((dir === this.directions.up && y === 0) ||
                (dir === this.directions.left && x === 0) ||
                (dir === this.directions.down && y === 100) ||
                (dir === this.directions.right && x === 99)) {
            return this.entities.wall;
        } else {
            target = this.getCreatureBefore();

            if (target) {
                if (target.dna === this.dna) {
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
                getCreature(this.loc.x, this.loc.y - 1);
                break;
            case this.directions.right:
                getCreature(this.loc.x + 1, this.loc.y);
                break;
            case this.directions.down:
                getCreature(this.loc.x, this.loc.y + 1);
                break;
            case this.directions.left:
                getCreature(this.loc.x - 1, this.loc.y);
                break;
        }
    },

    act: function() {
        if (!this.dead) {
            this.days_since_food += 1;

            switch(this.getBefore()) {
                case this.entities.friend:
                    break;
                case this.entities.enemy:
                    this.eat(this.getCreatureBefore());
                    break;
                case this.entities.empty:
                    this.move();
                    break;
                case this.entities.wall:
                    this.turn_left();
                    break;
            }
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
        // TODO
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
