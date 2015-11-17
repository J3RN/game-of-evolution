QUnit.test("Color does not change with size", function(assert) {
    var dna1 = [3, 1, 0, 0, 0, 0, 0];
    var dna2 = [0, 1, 0, 0, 0, 0, 0];

    assert.equal(DNA.computeColor(dna1), DNA.computeColor(dna2), "DNA colors are equal");
    assert.ok(DNA.computeColor(dna1) !== NaN);
});
