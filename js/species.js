var SPECIES = {
    species: [],

    createSpecies: function(species) {
        return SPECIES.randomColor();
    },

    randomColor: function() {
        return [
            SPECIES.randomRGB(),
            SPECIES.randomRGB(),
            SPECIES.randomRGB()
        ]
    },

    randomRGB: function() {
        return Math.floor(Math.random() * 254) + 1;
    },
}
