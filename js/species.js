var SPECIES = {
    species: [],

    createSpecies: function(species) {
        return SPECIES.randomColor();
    },

    randomColor: function() {
        return [
            SPECIES.randomUint8(),
            SPECIES.randomUint8(),
            SPECIES.randomUint8()
        ]
    },

    randomUint8: function() {
        return Math.floor(Math.random() * 256);
    },
}
