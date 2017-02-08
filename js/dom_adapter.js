'use strict';
// DomAdapter object retains state, allowing us to update elements repeatedly
// without querying for them each time

var DomAdapter = function() {
    this.turnCounter            = document.getElementById('game-turn');
    this.creatureCounter        = document.getElementById('creature-count');
    this.aliveCounter           = document.getElementById('alive');
    this.deadCounter            = document.getElementById('dead');
    this.avgSizeIndicator       = document.getElementById('avg-size');
    this.maxTurnsCounter        = document.getElementById('max-time');
    this.gameCounter            = document.getElementById('game-count');
    this.canvas                 = document.getElementById('canvas');
    this.inspectElement         = document.getElementById('inspect');

    // Inspect listener
    var domAdapter = this;
    var inspecting = false;

    document.onclick = function() {
        domAdapter.disableInspect();
    };

    document.onmousemove = function(mouseEvent) {
        domAdapter.inspect(mouseEvent);
    };
}

DomAdapter.prototype = {
    updateTurnCount: function(turns) {
        this.turnCounter.textContent = "Turn: " + GAME.turns;
    },
    updateCreatureCount: function(count) {
        this.creatureCounter.textContent = count;
    },
    updateAliveCount: function(alive) {
        this.aliveCounter.textContent = alive;
    },
    updateDeadCount: function(dead) {
        this.deadCounter.textContent = dead;
    },
    updateAvgSizeIndicator: function(avgSize) {
        this.avgSizeIndicator.textContent = "Average Size: " + avgSize.toFixed(2);
    },
    updateTopSpeciesList: function(topSpecies) {
        for (var x = 1; x < 6; x++) {
            var color = topSpecies[x - 1];

            if (color) {
                document.getElementById("top" + x + "color").style.background = "hsl(" + color + ", 100%, 50%)";
                document.getElementById("top" + x + "name").textContent = color;
                document.getElementById("top" + x + "count").textContent = GAME.species[color];
            } else {
                document.getElementById("top" + x + "color").style.background = "none";
                document.getElementById("top" + x + "name").textContent = "";
                document.getElementById("top" + x + "count").textContent = "";
            }

        }
    },
    updateGameCount: function(count) {
        this.gameCounter.textContent = "Game #" + count;
    },
    updateMaxTurnsCount: function(turns) {
        this.maxTurnsCounter.textContent = "Max Turns: " + turns;
    },
    disableInspect: function() {
        this.inspecting = !this.inspecting;

        if (!this.inspecting) {
            this.inspectElement.style.display = 'none';
        }
    },
    inspect: function(mouseEvent) {
        if (this.inspecting) {
            var boardSide = GAME.board.width; // Assumes square

            var xCoordinate = (mouseEvent.clientX - this.canvas.offsetLeft);
            var yCoordinate = (mouseEvent.clientY - this.canvas.offsetTop);

            var xPercent = xCoordinate / this.canvas.offsetWidth;
            var yPercent = yCoordinate / this.canvas.offsetHeight;

            var boardX = Math.floor(xPercent * boardSide);
            var boardY = Math.floor(yPercent * boardSide);

            var item = GAME.board.getItem({x: boardX, y: boardY});

            if (item) {
                var description = DNA.describeDNA(item.dna);

                var table = "<table><tbody>";
                Object.keys(description).forEach(function(e) {
                    table += "<tr><td>" + e + "</td><td>" + description[e] + "</td></tr>";
                });
                this.inspectElement.innerHTML = table + "</tbody></table>";

            }

            // Position and show
            this.inspectElement.style.display = 'block';
            this.inspectElement.style.position = 'fixed';
            this.inspectElement.style.top = mouseEvent.clientY + 'px';
            this.inspectElement.style.left = mouseEvent.clientX + 'px';
        }
    }
};
