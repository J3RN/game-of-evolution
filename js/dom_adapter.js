// DomAdapter object retains state, allowing us to update elements repeatedly
// without querying for them each time

var DomAdapter = function() {
    this.turnCounter =          document.getElementById('game-turn');
    this.creatureCounter =      document.getElementById('creature-count');
    this.aliveCounter =         document.getElementById('alive');
    this.deadCounter =          document.getElementById('dead');
    this.avgSizeIndicator =     document.getElementById('avg-size');
    this.maxTurnsCounter =      document.getElementById('max-time');
}

DomAdapter.prototype = {
    updateTurnCounter: function(turns) {
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

            document.getElementById("top" + x + "color").textContent = color;

            if (color) {
                document.getElementById("top" + x + "color").style.color = "hsl(" + color + ", 100%, 50%)";
            } else {
                document.getElementById("top" + x + "color").style.color = "none";
            }

            document.getElementById("top" + x + "count").textContent = GAME.species[color];
        }
    },

};
