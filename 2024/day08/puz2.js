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

                // create a vector in the tower 1 => tower 2 direction and continue scaling it up until it's invalid
                let vecT1T2 = vecBetweenPoints(t1, t2);
                console.log(`t1: ${t1}`);
                for (let i = 1; true; i++) {
                    let scaledVec = vecScale(vecT1T2, i);
                    let antinode = vecAdd(t1, scaledVec);
                    console.log(`t1: checking ${antinode}`);
                    if (vecValidate(antinode, map)) {
                        console.log(`found an antinode at ${antinode}`);
                        const key = `${antinode}`;
                        antinodes[key] = true;
                    }
                    else {
                        break;
                    }
                }

                // create a vector in the tower 2 => tower 1 direction and continue scaling it up until it's invalid
                let vecT2T1 = vecBetweenPoints(t2, t1);
                console.log(`t2: ${t2}`);
                for (let i = 1; true; i++) {
                    let scaledVec = vecScale(vecT2T1, i);
                    let antinode = vecAdd(t2, scaledVec);
                    console.log(`t2: checking ${antinode}`);
                    if (vecValidate(antinode, map)) {
                        console.log(`found an antinode at ${antinode}`);
                        const key = `${antinode}`;
                        antinodes[key] = true;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    })

    console.log(Object.keys(antinodes).sort());
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
