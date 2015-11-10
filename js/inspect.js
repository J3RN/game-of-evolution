'use strict';

function inspectCreature(mouseEvent) {
    var element = document.getElementsByTagName("canvas")[0];

    var boardSide = GAME.board.length; // Assumes square

    var xPercent = mouseEvent.offsetX / element.offsetWidth;
    var yPercent = mouseEvent.offsetY / element.offsetWidth;

    var boardX = Math.floor(xPercent * boardSide);
    var boardY = Math.floor(yPercent * boardSide);

    var item = GAME.getItem(boardX, boardY);

    if (item) {
        var description = DNA.describeDNA(item.dna);

        element.title = Object.keys(description).reduce(function(acc, e) {
            if (acc !== "") {
                acc += "\n"
            }

            return acc + e + ": " + description[e];
        }, "");
    }
}
