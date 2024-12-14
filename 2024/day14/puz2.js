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
    // let map = [11, 7];
    // console.log(robots);
    // robots.forEach(robot => moveRobot(map, robot, 100));

    let maxConn = -1;
    let maxConnCount = 0;

    for (let i = 1; i <= 50000; i++) {
        // move the robots one second at a time
        robots.forEach(robot => moveRobot(map, robot, 1));

        let vis = mapRobots(map, robots);

        let connected = checkConnection(robots, vis);

        if (connected >= maxConnCount) {
            maxConnCount = connected;
            maxConn = i;
            saveVis(vis, `blink${i}`);
        }

        if (connected === robots.length) {
            console.log(`they were connected!`);
            saveVis(vis, `blink${i}`);
            break;
        }
    }

    console.log(`most connected: ${maxConnCount} at ${maxConn}`);

    // console.log(robots);

    // let counts = countQuadrants(map, robots)
    // console.log(counts);

    // let score = counts.reduce((a, b) => a * b);

    // console.log(score);
    // saveMap(map, robots);
});

function moveRobot(map, robot, seconds) {
    // mod ignores the amount of times the robot wraps completely
    let realOffset = [(robot.v[0] * seconds) % map[0], (robot.v[1] * seconds) % map[1]];

    // console.log(`robot that started at ${robot.p} will move ${realOffset} in ${seconds} second(s)`)

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

function mapRobots(map, robots) {
    let vis = [];
    for (let r = 0; r < map[1]; r++) {
        let row = [];
        for (let c = 0; c < map[0]; c++) {
            row.push(0);
        }
        vis.push(row);
    }

    robots.forEach(robot => {
        vis[robot.p[1]][robot.p[0]] += 1;
    });

    return vis;
}

function saveVis(vis, fileName = "output.txt") {
    var file = fs.createWriteStream(`./output/${fileName}`);
    file.on('error', function (err) { /* error handling */ });
    vis.forEach(function (v) { file.write(v.join(' ') + '\n'); });
    file.end();
}

function checkConnection(robots, vis) {
    let maxCt = 0;
    let maxR = -1;
    for (let r = 0; r < robots.length; r++) {
        let connectedCount = growIsland(vis, [robots[r].p[1], robots[r].p[0]]);

        if (connectedCount > maxCt) {
            maxR = r;
            maxCt = connectedCount;
        }
    }

    return maxCt;
}

function countIslands(vis) {
    let islandCount = 0;

    // find the islands with non-zeroes
    for (let r = 0; r < vis.length; r++) {
        for (let c = 0; c < vis[0].length; c++) {
            if (vis[r][c] !== 0) {
                console.log(`found an island`)
                islandCount++;
                growIsland(vis, [r, c]);
            }
        }
    }

    return islandCount;
}

function growIsland(vis, cell) {
    let countFound = 0;
    let stack = [cell];

    while (stack.length > 0) {
        let [x, y] = stack.pop();

        // Check if the cell is within bounds
        if (x < 0 || x >= vis.length || y < 0 || y >= vis[0].length) {
            continue;
        }

        // If the cell is not a zero and not already seen (marked with a '.')
        if (vis[x][y] === 0) {
            continue;
        }

        if (vis[x][y] !== ".") {
            // Mark the cell as seen
            vis[x][y] = ".";
            countFound++;

            // Push neighboring cells onto the stack
            stack.push([x - 1, y]); // up
            stack.push([x, y + 1]); // right
            stack.push([x + 1, y]); // down
            stack.push([x, y - 1]); // left
            stack.push([x - 1, y + 1]); // up-right
            stack.push([x + 1, y + 1]); // down-right
            stack.push([x + 1, y - 1]); // down-left
            stack.push([x - 1, y - 1]); // up-left
        }
    }

    return countFound;
}
