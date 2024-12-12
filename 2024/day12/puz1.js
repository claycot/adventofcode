const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let map = [];

// read in the farm map as a 2D array
fileIter.on('line', function (line) {
    map.push(line.split(""));
});

fileIter.on('close', function (_) {
    // each group of crops is an island
    let islands = [];
    let cost = 0;

    // loop over the map, finding the area and perimeter of islands
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            // check if the current tile has already been processed
            if (map[r][c] === map[r][c].toLowerCase()) {
                continue;
            }

            // otherwise, create a new island
            let island = {
                "crop": map[r][c],
                "area": 0,
                "perimeter": 0,
            }
            mapIsland(map, [r, c], island);
            cost += (island.area * island.perimeter);
            islands.push(island);
        }
    }

    console.log(islands);
    console.log(cost);
});

// create an island by lowercasing all cells and getting their area and perimeter
function mapIsland(map, cell, island) {
    const r = cell[0];
    const c = cell[1];

    // if outside the bounds, return false;
    if (r < 0 || c < 0 || r >= map.length || c >= map[0].length) {
        return false;
    }

    // if the square has already been counted, but it's of the same type, return true;
    if (map[r][c] === island.crop.toLowerCase()) {
        return true;
    }

    // if the cell isn't the same as the island, return false;
    if (map[r][c] !== island.crop) {
        return false;
    }

    // otherwise, count the cell!
    map[r][c] = map[r][c].toLowerCase();

    // area increments for each crop tile
    island.area++;

    // perimeter increments by how many non-same crop tiles are touching
    // look up
    if (!mapIsland(map, [r - 1, c], island)) {
        island.perimeter++;
    }
    // look right
    if (!mapIsland(map, [r, c + 1], island)) {
        island.perimeter++;
    }
    // look down
    if (!mapIsland(map, [r + 1, c], island)) {
        island.perimeter++;
    }
    // look left
    if (!mapIsland(map, [r, c - 1], island)) {
        island.perimeter++;
    }

    return true;
}
