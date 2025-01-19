import fs from "node:fs";
import readline from "node:readline";

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const wires: Record<string, number> = {};
const wireEqs: Record<string, string> = {};

fileIter.on('line', function (line: string) {
    // handle lines that contain colons: these are init values
    if (line.includes(":")) {
        const [wire, val] = line.split(": ");
        wires[wire] = parseInt(val, 10);
    }

    // handle lines that contain arrows: these are equations
    else if (line.includes("->")) {
        const [eq, wire] = line.split(" -> ");
        wireEqs[wire] = eq;
    }
});

fileIter.on('close', function (line) {
    // once we have functions that link all of the wire values, get all of the z values
    // find how many z wires there are
    const numBits = Object.keys(wireEqs).filter(wire => wire.charAt(0) === "z").length;
    let outWires: number[] = Array(numBits);

    for (const wire of Object.keys(wireEqs).filter(wire => wire.charAt(0) === "z")) {
        const wireNum: number = parseInt(wire.substring(1), 10);
        outWires[wireNum] = getValue(wire);
    }

    Promise.all(outWires).then(bits => {
        console.log(bits);
        // this is annoying but the z00 value actually goes on the right of the binary number (highest index, lowest binary exponent)
        console.log(parseInt(bits.reverse().join(""), 2));
    });
});

function getValue(wire: string): number {
    let valOut = -1;
    if (wires.hasOwnProperty(wire)) {
        return wires[wire];
    }
    else if (wireEqs.hasOwnProperty(wire)) {
        const [w1, op, w2] = wireEqs[wire].split(" ");

        const val1 = getValue(w1);
        const val2 = getValue(w2);
        switch (op) {
            case "OR":
                valOut = val1 | val2;
                break;
            case "AND":
                valOut = val1 & val2;
                break;
            case "XOR":
                valOut = val1 ^ val2;
                break;
            default:
                throw new Error(`Invalid operation: ${op}`);
        }

        wires[wire] = valOut;
    }

    return valOut;
}
