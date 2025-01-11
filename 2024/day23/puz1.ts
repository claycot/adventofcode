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
    if (a.localeCompare(b) < 0) {
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
    // for each link in the map, trace it to a depth of 3 (a - b, b - c, a - c)
    const partiesFound: string[][] = [];
    // console.log(links);
    for (let node of Object.keys(links)) {
        traceLink(links, [node], 3).forEach(link => {
            partiesFound.push(link);
        });
    }
    console.log(partiesFound.filter(party => filterParties(party, "t")).length);
});

function traceLink(links: Record<string, string[]>, path: string[], goal: number): string[][] {
    // if we have linked 3 nodes, return
    if (path.length === goal) {
        // return success if the first node includes the last node
        if (links[path[0]].includes(path[goal - 1])) {
            return [path];
        }
        // return failure if the last node is not linked to the first node
        else {
            return [];
        }
    }

    // otherwise, just proceed down all paths
    const linkParties: string[][] = [];
    if (links.hasOwnProperty(path[path.length - 1])) {
        links[path[path.length - 1]].forEach(node => {
            path.push(node);
            traceLink(links, path, goal).forEach(found => {
                linkParties.push([...found]);
            });
            path.pop();
        });
    }

    return linkParties;
}

function filterParties(party: string[], subStr: string): boolean {
    for (let c = 0; c < party.length; c++) {
        if (party[c].startsWith(subStr)) {
            return true;
        }
    }
    return false;
}