'use strict';

class View {
    constructor(width, height) {
        var canvas = document.getElementById('canvas');

        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        this.turnCounter =          document.getElementById('game-turn');
        this.creatureCounter =      document.getElementById('creature-count');
        this.aliveCounter =         document.getElementById('alive');
        this.deadCounter =          document.getElementById('dead');
        this.avgSizeIndicator =     document.getElementById('avg-size');
        this.maxTurnsCounter =      document.getElementById('max-time');
        this.gameCounter =          document.getElementById('game-count');
    }

    setCell(x, y, hsl) {
        var width = 500 / this.width;
        var height = 500 / this.height;

        this.ctx.fillStyle = 'hsl(' + hsl.join(',') + ')';
        this.ctx.fillRect(x * width, y * height, width, height);
    }

    updateTurnCount(turns) {
        this.turnCounter.textContent = "Turn: " + GAME.turns;
    }

    updateCreatureCount(count) {
        this.creatureCounter.textContent = count;
    }

    updateAliveCount(alive) {
        this.aliveCounter.textContent = alive;
    }

    updateDeadCount(dead) {
        this.deadCounter.textContent = dead;
    }

    updateAvgSizeIndicator(avgSize) {
        this.avgSizeIndicator.textContent = "Average Size: " + avgSize.toFixed(2);
    }

    updateTopSpeciesList(topSpecies) {
        for (var x = 1; x < 6; x++) {
            var color = topSpecies[x - 1];

            document.getElementById("top" + x + "color").textContent = color;

            if (color) {
                document.getElementById("top" + x + "color").style.color = "hsl(" + color + ", 100%, 50%)";
            } else {
                document.getElementById("top" + x + "color").style.color = "none";
            }

            document.getElementById("top" + x + "count").textContent = GAME.species[color];
        }
    }

    updateGameCount(count) {
        this.gameCounter.textContent = "Game #" + count;
    }

    updateMaxTurnsCount(turns) {
        this.maxTurnsCounter.textContent = "Max Turns: " + turns;
    }
};
