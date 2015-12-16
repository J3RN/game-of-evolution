'use strict';

var Board = function() {
    this.changed = [];
    this.board = [];

    this.width =  100;
    this.height = 100;

    this.canvasAdapter = new CanvasAdapter(this);

    for (var x = 0; x < this.width; x++) {
        this.board[x] = [];

        for (var y = 0; y < this.height; y++) {
            this.board[x][y] = undefined;
        }
    }
}

Board.prototype = {
    isOutOfBounds: function(loc) {
        if (loc.x >= 0 && loc.x < this.width &&
                loc.y >= 0 && loc.y < this.height) {
            return false;
        } else {
            return true;
        }
    },

    getItem: function(loc) {
        if (this.isOutOfBounds(loc)) {
            return undefined;
        } else {
            return this.board[loc.x][loc.y];
        }
    },

    addCreature: function(creature) {
        this.board[creature.loc.x][creature.loc.y] = creature;
        this.changed.push(creature.loc);
    },

    removeCreature: function(loc) {
        delete this.board[loc.x][loc.y];
        this.changed.push(loc);
    },

    moveCreature: function(creature, oldLoc, newLoc) {
        this.board[newLoc.x][newLoc.y] = this.getItem(oldLoc);
        this.board[oldLoc.x][oldLoc.y] = undefined;

        this.changed.push(oldLoc);
        this.changed.push(newLoc);
    },

    randomEmptyLocation: function() {
        var randomLocation;

        do {
            randomLocation = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
        } while (this.getItem(randomLocation));

        return randomLocation;
    },

    clear: function() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var loc = {x: x, y: y};

                if (this.getItem(loc)) {
                    delete this.board[x][y];
                    this.changed.push(loc);
                }
            }
        }
    },

    redraw: function() {
        while (this.changed.length > 0) {
            var loc = this.changed.pop();
            var creature = this.getItem(loc);

            var x = loc.x;
            var y = loc.y;

            if (creature) {
                if (creature.dead) {
                    this.canvasAdapter.setCell(x, y, [creature.color, "75%", "30%"]);
                } else {
                    this.canvasAdapter.setCell(x, y, [creature.color, "100%", "50%"]);
                }
            } else {
                this.canvasAdapter.setCell(x, y, [0, "100%", "100%"]);
            }
        }
    },
}
