const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let robots = [];

fileIter.on('line', function (line) {
    robots.push({
        "p": [
            parseInt(line.split(" ")[0].split("=")[1].split(",")[0], 10),
            parseInt(line.split(" ")[0].split("=")[1].split(",")[1], 10)
        ],
        "v": [
            parseInt(line.split(" ")[1].split("=")[1].split(",")[0], 10),
            parseInt(line.split(" ")[1].split("=")[1].split(",")[1], 10)
        ],
    });
});

fileIter.on('close', function (_) {
    let map = [101, 103];
    console.log(robots);
    robots.forEach(robot => moveRobot(map, robot, 100));

    console.log(robots);

    let counts = countQuadrants(map, robots)
    console.log(counts);

    let score = counts.reduce((a, b) => a * b);

    console.log(score);
});

function moveRobot(map, robot, seconds) {
    // mod ignores the amount of times the robot wraps completely
    let realOffset = [(robot.v[0] * seconds) % map[0], (robot.v[1] * seconds) % map[1]];

    console.log(`robot that started at ${robot.p} will move ${realOffset} in ${seconds} second(s)`)

    robot.p[0] += realOffset[0];
    if (robot.p[0] < 0) {
        robot.p[0] += map[0];
    }
    else if (robot.p[0] >= map[0]) {
        robot.p[0] -= map[0];
    }

    robot.p[1] += realOffset[1];
    if (robot.p[1] < 0) {
        robot.p[1] += map[1];
    }
    else if (robot.p[1] >= map[1]) {
        robot.p[1] -= map[1];
    }

    return;
}

function countQuadrants(map, robots) {
    let counts = [0, 0, 0, 0];

    robots.forEach(robot => {
        // check left/right status
        if (robot.p[0] < Math.floor(map[0] / 2)) {
            // check up/down status
            if (robot.p[1] < Math.floor(map[1] / 2)) {
                // quad 0
                counts[0]++;
            }
            else if (robot.p[1] > Math.floor(map[1] / 2)) {
                // quad 2
                counts[2]++;
            }
        }
        else if (robot.p[0] > Math.floor(map[0] / 2)) {
            // check up/down status
            if (robot.p[1] < Math.floor(map[1] / 2)) {
                // quad 1
                counts[1]++;
            }
            else if (robot.p[1] > Math.floor(map[1] / 2)) {
                // quad 3
                counts[3]++;
            }
        }
    });

    return counts;
}
