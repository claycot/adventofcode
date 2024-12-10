const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let map = [];

// read in the trail map as a 2D array
fileIter.on('line', function (line) {
    map.push(line.split("").map(intChar => parseInt(intChar, 10)));
});

fileIter.on('close', function (_) {
    // 2 approaches:
    // a: start at 0, looking to increase by 1 in any direction, until reaching 9
    let scoreSum = 0;
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            if (map[r][c] === 0) {
                console.log(`there is a trailhead at [${r}, ${c}]`);
                let path = [];
                let peaks = {};
                followPath(map, [r, c], path, peaks);
                console.log(`reached ${Object.keys(peaks).length} peak(s)`);
                scoreSum += Object.keys(peaks).length;
            }
        }
    }
    // b: start at 9, looking to decrease by 1 in any direction, until reaching 0

    // either approach will have to account for different ways the same trailhead can reach the same peak


    console.log(scoreSum);
});

// follow the path until reaching 9 or dead end
function followPath(map, cell, path, peaks) {
    const r = cell[0];
    const rLast = path.length ? path[path.length - 1][0] : null;
    const c = cell[1];
    const cLast = path.length ? path[path.length - 1][1] : null;

    // if we're outside of the map or it's not increasing, this path ends
    if (!checkBounds(map, [r, c]) ||
        (rLast !== null && cLast !== null && (map[r][c] !== (map[rLast][cLast] + 1)))
    ) {
        // console.log(`bounds or increase not met by moving to [${r}, ${c}], returning false`);
        return false;
    }

    // otherwise, add this cell to the path
    // console.log(`adding [${r}, ${c}] to path!`);
    path.push([r, c]);
    // console.log(path);
    
    // if we're at a peak, return true!
    if (map[r][c] === 9) {
        // console.log(`reached a peak!`);
        peaks[`${r},${c}`] = true;
        return true;
    }
    
    // otherwise, check if any of the paths from this point reach peaks
    let originalPath = [...path];

    // check up
    followPath(map, [r - 1, c], path, peaks);
    path = [...originalPath];
    // check right
    followPath(map, [r, c + 1], path, peaks);
    path = [...originalPath];
    // check down
    followPath(map, [r + 1, c], path, peaks);
    path = [...originalPath];
    // check left
    followPath(map, [r, c - 1], path, peaks);
    path = [...originalPath];

    return;
}

function checkBounds(map, cell) {
    return 0 <= cell[0] && 0 <= cell[1] && cell[0] < map.length && cell[1] < map[0].length;
}
