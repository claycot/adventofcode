import fs from "node:fs";
import readLine from "node:readline";

const lineReader = readLine.createInterface({
    input: fs.createReadStream("input.txt"),
});

interface TrieNode {
    complete: boolean;
    children: Record<string, TrieNode>;
}

let avail: string[] = [];
let desired: string[] = [];

// read the desired patterns and the available towels
lineReader.on("line", function (line: string) {
    if (line.includes(",")) {
        avail = line.split(", ");
    } else if (line.length) {
        desired.push(line);
    }
});

// use backtracking to make the desired patterns with the available towels
lineReader.on("close", function () {
    // create a trie to track the available towels
    const towelTrie: TrieNode = {
        complete: true,
        children: {},
    };
    // load the towels into the trie
    avail.forEach((towel) => {
        loadTrie(towelTrie, towel);
    });

    // use the towel trie to backtrack over each desired towel pattern
    let success = 0;
    desired.forEach((pattern) => {
        console.log(`attempting to create: ${pattern}`);
        if (arrangeTowels(pattern, 0, towelTrie, [])) {
            success++;
        }
    });

    console.log(success);
});

function arrangeTowels(
    goal: string,
    offset: number,
    towels: TrieNode,
    path: string[],
): boolean {
    if (goal.length === offset) {
        console.log(`complete!`);
        console.log(`Path taken: ${path.join(' -> ')}`);
        return true;
    }

    // try using the trie to overlay the whole thing, ceding one stripe at a time...
    for (let l = goal.length; l > offset; l--) {
        // console.log(`attempting to overlay ${goal.substring(0, l)}`);
        if (checkTrie(towels, goal.substring(offset, l))) {
            // console.log(
                // `it worked! sending ${goal.substring(l)} to get completed`,
            // );
            path.push(goal.substring(offset, l));
            if (arrangeTowels(goal, l, towels, path)) {
                return true;
            }
            path.pop();
        }
    }

    // if no towel combination fulfilled the goal, return false
    // console.log(`failed to create ${goal}...`);
    return false;
}

// add the value to the trie
function loadTrie(head: TrieNode, val: string): void {
    // dig into the trie one node at a time, adding nodes as necessary
    let node = head;
    for (let c = 0; c < val.length; c++) {
        // if the node didn't exist, create it
        if (!node.children.hasOwnProperty(val.charAt(c))) {
            node.children[val.charAt(c)] = {
                complete: false,
                children: {},
            };
        }
        // dig further into the trie
        node = node.children[val.charAt(c)];
    }

    // mark the last character of the val as complete
    node.complete = true;
}

// check if the value exists in the trie
function checkTrie(head: TrieNode, val: string): boolean {
    let node = head;

    // dig into the trie one node at a time, stopping if it doesn't exist
    for (let c = 0; c < val.length; c++) {
        if (!node.children.hasOwnProperty(val.charAt(c))) {
            return false;
        }
        node = node.children[val.charAt(c)];
    }

    return node.complete;
}
