import fs from "node:fs";
import readline from "node:readline";

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const links: Record<string, string[]> = {};

fileIter.on('line', function (line) {
    // load the connection map alphabetically so we don't have repeated data
    const [a, b]: string[] = line.split("-");
    // if negative, the vals are flipped alphabetically
    if (a.localeCompare(b) > 0) {
        if (!links.hasOwnProperty(b)) {
            links[b] = [];
        }
        links[b].push(a);
    }
    else {
        if (!links.hasOwnProperty(a)) {
            links[a] = [];
        }
        links[a].push(b);
    }
});

fileIter.on('close', function (line) {
    let maxParty: string[] = [];
    // from each possible starting node, find the biggest party
    for (let node of Object.keys(links)) {
        const partyFromHere = findBiggestParty(links, [node]);
        if (partyFromHere.length > maxParty.length) {
            maxParty = [...partyFromHere];
        }
    }
    console.log(maxParty.join(","));
});

// given a path, find the biggest party that can be formed
function findBiggestParty(links: Record<string, string[]>, path: string[]): string[] {
    // if the last node can add additional nodes, attempt to do so
    if (links.hasOwnProperty(path[path.length - 1])) {
        let maxParty: string[] = [];

        // try to add each node the last node can reach
        links[path[path.length - 1]].forEach(node => {
            // check if all of the prior nodes can also reach the next node
            for (let n = 0; n < path.length - 1; n++) {
                if (!links[path[n]].includes(node)) {
                    // this return breaks the forEach only
                    return;
                }
            }

            // if so, push the node to the party
            path.push(node);

            // attempt to add to the party
            const foundPath = findBiggestParty(links, path);

            // if the party is our new max, save it
            if (foundPath.length > maxParty.length) {
                maxParty = [...foundPath];
            }
            path.pop();
        });
        return maxParty;
    }
    // otherwise, end in failure
    else {
        // if the loop closes, return true
        if (links.hasOwnProperty(path[0]) && links[path[0]].includes(path[path.length - 1])) {
            return [...path];
        }
        // if the loop does not close, return false
        else {
            return [];
        }
    }
}