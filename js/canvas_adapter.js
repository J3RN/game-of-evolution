var ADAPTER = {
    HEIGHT: 200,
    WIDTH: 200,

    load: function() {
        var canvas = document.getElementById('canvas');
        ADAPTER.ctx = canvas.getContext('2d');
    },

    setCell: function(x, y, hsl) {
        var width = 500 / this.WIDTH;
        var height = 500 / this.HEIGHT;

        ADAPTER.ctx.fillStyle = 'hsl(' + hsl.join(',') + ')';
        ADAPTER.ctx.fillRect(x * width, y * height, width, height);
    }
};
