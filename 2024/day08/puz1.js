const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let map = [];
let towers = {};

fileIter.on('line', function (line) {
    const chars = line.split("");
    map.push(chars);
    for (let c = 0; c < line.length; c++) {
        if (chars[c] !== ".") {
            if (!towers.hasOwnProperty(chars[c])) {
                towers[chars[c]] = [];
            }
            towers[chars[c]].push([map.length - 1, c]);
        }
    }
});

fileIter.on('close', function (_) {
    let antinodes = {};

    // between each combination of towers on a given frequency,
    Object.values(towers).forEach(towerSet => {
        for (let t = 0; t + 1 < towerSet.length; t++) {
            for (let u = t + 1; u < towerSet.length; u++) {
                let t1 = towerSet[t];
                let t2 = towerSet[u];

                // create a vector in the tower 1 => tower 2 direction and double it, checking if the resulting vector is valid
                let vecT1T2 = vecBetweenPoints(t1, t2);
                let doubleVecT1T2 = vecScale(vecT1T2, 2);
                let antiNodeT1T2 = vecAdd(t1, doubleVecT1T2);
                if (vecValidate(antiNodeT1T2, map)) {
                    console.log(`found an antinode at ${antiNodeT1T2}`);
                    const key = `${antiNodeT1T2}`;
                    antinodes[key] = true;
                }

                // create a vector in the tower 2 => tower 1 direction and double it, checking if the resulting vector is valid
                let vecT2T1 = vecBetweenPoints(t2, t1);
                let doubleVecT2T1 = vecScale(vecT2T1, 2);
                let antiNodeT2T1 = vecAdd(t2, doubleVecT2T1);
                if (vecValidate(antiNodeT2T1, map)) {
                    console.log(`found an antinode at ${antiNodeT2T1}`);
                    const key = `${antiNodeT2T1}`;
                    antinodes[key] = true;
                }
            }
        }
    })

    console.log(Object.keys(antinodes).length);
});

// validate that the vector exists on the map
function vecValidate(vec, map) {
    // vector must be a whole number
    let wholeNum = vec[0] % 1 === 0
        && vec[1] % 1 === 0;

    // vector must be within map
    let withinBounds = vec[0] >= 0
        && vec[1] >= 0
        && vec[0] < map.length
        && vec[1] < map[0].length;

    return wholeNum && withinBounds;
}

// given two points (in vector notation, draw a vector between them)
function vecBetweenPoints(pt1, pt2) {
    return [pt2[0] - pt1[0], pt2[1] - pt1[1]];
}

// scale a vector
function vecScale(vec, scale) {
    return [vec[0] * scale, vec[1] * scale];
}

// add a vector to a point (in vector notation)
function vecAdd(pt, vec) {
    return [pt[0] + vec[0], pt[1] + vec[1]];
}
