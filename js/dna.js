'use strict';

var DNA = {
    generateDNA: function() {
        return [
            this.randomColor(),
            Math.ceil(Math.random() * 10),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
            DNA.randomBehavior(),
        ];
    },

    mergeDNA: function(indiv1, indiv2) {
        var dna_length = indiv1.dna.length;
        var new_dna = [];

        for (var i = 0; i < dna_length; i++) {
            if (Math.random() > 0.5) {
                new_dna.push(indiv1.dna[i]);
            } else {
                new_dna.push(indiv2.dna[i]);
            }
        }

        // 1% chance of mutation
        if (Math.random() <= 0.01) {
            var index = Math.floor(Math.random() * 6) + 2;
            new_dna[index] = DNA.randomBehavior();
        }

        return new_dna;
    },

    copyDNA: function(dna) {
        var new_dna = [];

        dna.forEach(function(gene) {
            new_dna.push(gene)
        });

        if (Math.random() <= 0.01) {
            var index = Math.floor(Math.random() * 6) + 2;
            new_dna[index] = DNA.randomBehavior();
        }

        return new_dna;
    },

    randomBehavior: function() {
        return Math.floor(Math.random() * 5);
    },

    describeDNA: function(dna) {
        var description = {};
        var actions = [ "eat", "mate", "turn left", "turn right", "move" ];
        var names = [ "Enemy", "Friend", "Empty", "Wall", "Dead Friend", "Dead Enemy" ];

        description["Color"] = dna[0];
        description["Size"] = dna[1];

        // Behavior
        var i;
        for (i = 2; i < 8; i++) {
            description[names[i - 2]] = actions[dna[i]];
        }

        return description;
    },

    decodeDNA: function(dna) {
        var description = this.describeDNA(dna);
        Object.keys(description).forEach(function(item) {
            console.log(item + ": " + description[item]);
        });
    },

    randomColor: function() {
        return Math.floor(Math.random() * 360)
    },
}

