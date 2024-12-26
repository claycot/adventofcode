import fs from "node:fs";
import readLine from "node:readline";

const lineReader = readLine.createInterface({
    input: fs.createReadStream("input.txt"),
});

interface Node {
    cell: number[];
    distance: number;
    via?: Node;
    facing: string;
}

// save the maze as a 2D arr of chars
const maze: string[][] = [];
// track nodes in the map, with key `${row},${col}`
const nodes: Record<string, Node> = {};
let startPos: number[] = [-1, -1];
let endPos: number[] = [-1, -1];

const dirLetters: Record<string, number[]> = {
    "r": [0, 1],
    "d": [1, 0],
    "l": [0, -1],
    "u": [-1, 0],
};

// direction keys if turning left or right
const dirTurns: Record<string, string[]> = {
    "r": ["u", "d"],
    "d": ["r", "l"],
    "l": ["d", "u"],
    "u": ["l", "r"],
};

// read the maze and start/end locations
lineReader.on("line", function (line) {
    // add a new row to the maze
    maze.push([]);
    line.split("").forEach((char) => {
        maze[maze.length - 1].push(char);

        // track start or end location
        if (char === "S") {
            startPos = [maze.length - 1, maze[maze.length - 1].length - 1];
        } else if (char === "E") {
            endPos = [maze.length - 1, maze[maze.length - 1].length - 1];
        }
    });
});

// after the maze is ready, use dijkstra's algo to solve it in the shortest time
// going forward costs 1, going left or right costs 1001
lineReader.on("close", function () {
    printMaze(maze);
    console.log(seekDijkstra(maze, {
        cell: startPos,
        distance: 0,
        via: undefined,
        facing: "r",
    }));
});

// util to print maze and start/end positions
function printMaze(maze: string[][]): void {
    maze.forEach((row) => {
        console.log(row.join(""));
    });

    console.log(`start:\t${startPos}`);
    console.log(`end:\t${endPos}`);
}

// from any node, how much does the next move cost?
// going forward costs 1 times as many tiles until the next junction
// going left or right costs 1000 + 1 times as many tiles until the next junction
function findNextJunction(
    maze: string[][],
    node: Node,
): Node | null {
    // a junction is defined as a place where you can turn left or right
    // so, continue straight until a turn is possible!
    let cell: number[] = [...node.cell];
    let leftCell: number[];
    let rightCell: number[];

    let distance: number = 0;
    do {
        // if goal is found, return it!
        if (maze[cell[0]][cell[1]] === "E") {
            break;
        }
        // if reaching a dead end, return null
        if (maze[cell[0]][cell[1]] === "#") {
            return null;
        }

        // otherwise, continue to follow the path straight
        distance++;
        cell = [
            cell[0] + dirLetters[node.facing][0],
            cell[1] + dirLetters[node.facing][1],
        ];
        leftCell = [
            cell[0] + dirLetters[dirTurns[node.facing][0]][0],
            cell[1] + dirLetters[dirTurns[node.facing][0]][1],
        ];
        rightCell = [
            cell[0] + dirLetters[dirTurns[node.facing][1]][0],
            cell[1] + dirLetters[dirTurns[node.facing][1]][1],
        ];
    } while (
        maze[leftCell[0]][leftCell[1]] === "#" &&
        maze[rightCell[0]][rightCell[1]] === "#"
    );

    // how far is any point from the start?
    // distance from last node "via" + last node's dist from start
    return {
        cell,
        distance: node.distance + distance,
        via: node,
        facing: node.facing,
    };
}

// what is the next move to explore?
// find the shortest distance from the goal and seek from there, adding each option to the queue
// organize the potential nodes with a minheap
function seekDijkstra(maze: string[][], node: Node): number {
    let queue: Node[] = [node];

    // while we aren't at the end, seek paths
    while (
        node.cell[0] !== endPos[0] && node.cell[1] !== endPos[1] && queue.length
    ) {
        let workingNode: Node = queue.shift()!;
        let nextNodes: (Node | null)[] = [];

        // find node in straight line
        nextNodes.push(findNextJunction(maze, workingNode));

        // find node left
        // note this incurs a 1000 distance penalty
        nextNodes.push(
            findNextJunction(
                maze,
                {
                    ...workingNode,
                    distance: workingNode.distance + 1000,
                    facing: dirTurns[workingNode.facing][0],
                },
            ),
        );

        // find node right
        // note this incurs a 1000 distance penalty
        nextNodes.push(
            findNextJunction(
                maze,
                {
                    ...workingNode,
                    distance: workingNode.distance + 1000,
                    facing: dirTurns[workingNode.facing][1],
                },
            ),
        );

        // console.log(`next nodes from ${workingNode.cell} are:`);
        // console.log(nextNodes.filter((node) => node !== null));
        // for each node, if it already exists, add it to the memo map
        nextNodes.filter((node) => node !== null).forEach((node) => {
            // memoize and return the cell, if it doesn't already exist or if this is a new shortest distance
            const cellKey = getCellKey(node.cell);
            if (
                !nodes.hasOwnProperty(cellKey) ||
                nodes[cellKey].distance > node.distance
            ) {
                nodes[cellKey] = node;
                // add to the queue
                queue.push(node);
            }
        });

        // sort the queue
        queue.sort((a, b) => {
            return a.distance - b.distance;
        });
    }

    console.log(
        Object.keys(nodes).filter((key) => key.substring(0, 2) === "1,"),
    );
    console.log(getPathString(nodes[getCellKey(endPos)]));
    return nodes.hasOwnProperty(getCellKey(endPos))
        ? nodes[getCellKey(endPos)].distance
        : -1;
}

// what is the path taken?
// all of the last nodes "via"
function getPathString(node?: Node): number[][] {
    const path: number[][] = [];

    while (node) {
        path.unshift(node.cell);
        node = node.via;
    }

    return path;
}

function getCellKey(cell: number[]): string {
    return `${cell[0]},${cell[1]}`;
}
