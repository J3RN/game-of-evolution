var ADAPTER = {};

function load() {
    if (document.readyState === 'loading') {
        setTimeout(load, 100);
    } else {
        var canvas = document.getElementById('canvas');
        ADAPTER.ctx = canvas.getContext('2d');
    }
}

function setCell(x, y, rgb) {
    ADAPTER.ctx.fillStyle = 'rgb(' + rgb.join(',') + ')';
    ADAPTER.ctx.fillRect(x * 5, y * 5, 5, 5);
}

load();
