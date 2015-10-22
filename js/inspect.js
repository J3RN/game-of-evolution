'use strict';

function inspectCreature(mouseEvent) {
    var element = document.getElementsByTagName("canvas")[0];

    var boardSide = GAME.board.length; // Assumes square

    var xPercent = mouseEvent.offsetX / element.offsetWidth;
    var yPercent = mouseEvent.offsetY / element.offsetWidth;

    var boardX = Math.floor(xPercent * boardSide) - 1;
    var boardY = Math.floor(yPercent * boardSide) - 1;

    var item = GAME.getItem(boardX, boardY);

    if (item) {
        var description = DNA.describeDNA(item.dna);

        Object.keys(description).forEach(function(item) {
            document.getElementById(item).textContent = description[item];
        });
    }
}
