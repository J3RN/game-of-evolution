var CanvasAdapter = function(board) {
    var canvas = document.getElementById('canvas');

    this.ctx = canvas.getContext('2d');
    this.board = board;
}

CanvasAdapter.prototype = {
    setCell: function(x, y, hsl) {
        var width = 500 / this.board.width;
        var height = 500 / this.board.height;

        this.ctx.fillStyle = 'hsl(' + hsl.join(',') + ')';
        this.ctx.fillRect(x * width, y * height, width, height);
    }
};
