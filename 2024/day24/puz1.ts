import fs from "node:fs";
import readline from "node:readline";

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const wires: Record<string, Function> = {};

fileIter.on('line', function (line: string) {
    // handle lines that contain colons: these are init values
    if (line.includes(":")) {
        const [wire, val] = line.split(": ");
        wires[wire] = () => Promise.resolve(parseInt(val, 10));
    }

    // handle lines that contain arrows: these are equations
    else if (line.includes("->")) {
        const [eq, wire] = line.split(" -> ");
        wires[wire] = () => promiseEquation(eq);
    }
});

fileIter.on('close', function (line) {
    // once we have functions that link all of the wire values, get all of the z values
    // find how many z wires there are
    const numBits = Object.keys(wires).filter(wire => wire.charAt(0) === "z").length;
    console.log(`there are ${numBits} z values`)
    let outWires: Promise<number>[] = Array(numBits);
    
    Object.keys(wires).filter(wire => wire.charAt(0) === "z").forEach(async wire => {
        const wireNum: number = parseInt(wire.substring(1), 10);
        outWires[wireNum] = wires[wire]();
    });

    Promise.all(outWires).then(bits => {
        console.log(bits);
        // this is annoying but the z00 value actually goes on the right of the binary number (highest index, lowest binary exponent)
        console.log(parseInt(bits.reverse().join(""), 2));
    });
});

function promiseEquation(equation: string): Promise<number> {
    const [w1, op, w2] = equation.split(" ");

    return new Promise(async (resolve, reject) => {
        const [val1, val2] = await Promise.all([wires[w1](), wires[w2]()])
        let outVal: number = -1;
        switch (op) {
            case "OR":
                outVal = val1 | val2;
                break;
            case "AND":
                outVal = val1 & val2;
                break;
            case "XOR":
                outVal = val1 ^ val2;
                break;
        }

        return resolve(outVal);
    })
}
