var SPECIES = {
    species: [],

    createSpecies: function(species) {
        return SPECIES.randomColor();
    },

    randomColor: function() {
        return Math.floor(Math.random() * 360)
    },
}
