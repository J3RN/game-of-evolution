function setCell(x, y, rgb) {
    document.getElementById(x + ',' + y).style.background = 'rgba(' + rgb.join(', ') + ', 0.9)';
}
