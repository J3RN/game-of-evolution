var DNA = {
    generateDNA: function(species) {
        return [
            species,
            Math.ceil(Math.random() * 10),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            0,
        ];
    },

    mergeDNA: function(species1, species2) {
        var dna_length = species1.dna.length;
        var new_dna = [];

        for (var i = 0; i < dna_length; i++) {
            if (Math.random() > 0.5) {
                new_dna.push(species1.dna[i]);
            } else {
                new_dna.push(species2.dna[i]);
            }
        }

        return new_dna;
    },

    randomBehavior: function() {
        return Math.floor(Math.random() * 5);
    },
}

