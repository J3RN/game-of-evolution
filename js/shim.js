function getRawTable() {
    all_cells = $('table').find('td');
    table_rep = [];

    for (i = 0; i < 100; i++) {
        begin_index = i * 100
        table_rep[i] = all_cells.slice(begin_index, begin_index + 100);
    }

    return table_rep;
}

function getTable() {
    return getRawTable().map(function(row) {
        return row.map(function(index, element) {
            rgba = $(element).css('background').match(/rgba\((.*)\)/)[1];
            return [rgba.split(', ').slice(0, 3).map(function (x) { return Number(x) })];
        });
    });
}

function getCell(x, y) {
    return getTable()[x][y];
}

function setCell(x, y, rgb) {
    return $(getRawTable()[y][x]).css('background',
            'rgba(' + rgb.join(', ') + ', 0.9)');
}
