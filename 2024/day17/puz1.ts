import fs from "node:fs";
import readLine from "node:readline";

const lineReader = readLine.createInterface({
    input: fs.createReadStream("input.txt"),
});

const instr: number[] = [];
const output: number[] = [];

// registers hold values
const register: number[] = [0, 1, 2, 3, 0, 0, 0];
// some registers have names
const registerIndex: Record<string, number> = {
    "A": 4,
    "B": 5,
    "C": 6,
};

// instruction pointer
let ptrIns: number = 0;

// read in the instructions
lineReader.on("line", function (line: string) {
    // if the line starts with "Register", try to assign it to a named register
    if (line.startsWith("Register")) {
        const regName: string = line.split(" ")[1].charAt(0);

        if (registerIndex.hasOwnProperty(regName)) {
            register[registerIndex[regName]] = parseInt(line.split(" ")[2], 10);
        }
    } 
    // if the line starts with "Program", add instructions
    else if (line.startsWith("Program")) {
        line.split(": ")[1].split(",").forEach((ins) => {
            instr.push(parseInt(ins, 10));
        });
    }
});

// execute the instructions
lineReader.on("close", function () {
    console.log(register);

    console.log(instr);

    while (ptrIns + 1 < instr.length) {
        exec(instr[ptrIns], instr[ptrIns + 1]);
    }

    console.log(output.join(","));
});

// execute a single instruction
function exec(opCode: number, val: number): boolean {
    switch (opCode) {
        // adv
        case 0:
            adv(val);
            break;
        // bxl
        case 1:
            bxl(val);
            break;
        // bst
        case 2:
            bst(val);
            break;
        // jnz
        case 3:
            jnz(val);
            break;
        // bxc
        case 4:
            bxc(val);
            break;
        // out
        case 5:
            out(val);
            break;
        // bdv
        case 6:
            bdv(val);
            break;
        // cdv
        case 7:
            cdv(val);
            break;
        default:
            return false;
    }
    return true;
}

function adv(val: number): boolean {
    let numerator: number = register[registerIndex["A"]];
    let denominator: number = 2 ** register[val];

    let res: number = Math.trunc(numerator / denominator);

    register[registerIndex["A"]] = res;
    ptrIns += 2;

    return true;
}

function bxl(val: number): boolean {
    let b: number = register[registerIndex["B"]];

    let res: number = b ^ val;

    register[registerIndex["B"]] = res;
    ptrIns += 2;

    return true;
}

function bst(val: number): boolean {
    let num: number = register[val];

    let res: number = num % 8;

    register[registerIndex["B"]] = res;
    ptrIns += 2;

    return true;
}

function jnz(val: number): boolean {
    let a: number = register[registerIndex["A"]];

    if (a === 0) {
        ptrIns += 2;
    } else {
        ptrIns = val;
    }

    return true;
}

function bxc(val: number): boolean {
    let b: number = register[registerIndex["B"]];
    let c: number = register[registerIndex["C"]];

    let res: number = b ^ c;

    register[registerIndex["B"]] = res;
    ptrIns += 2;

    return true;
}

function out(val: number): boolean {
    let res: number = register[val] % 8;

    output.push(res);
    ptrIns += 2;

    return true;
}

function bdv(val: number): boolean {
    let numerator: number = register[registerIndex["A"]];
    let denominator: number = 2 ** register[val];

    let res: number = Math.trunc(numerator / denominator);

    register[registerIndex["B"]] = res;
    ptrIns += 2;

    return true;
}

function cdv(val: number): boolean {
    let numerator: number = register[registerIndex["A"]];
    let denominator: number = 2 ** register[val];

    let res: number = Math.trunc(numerator / denominator);

    register[registerIndex["C"]] = res;
    ptrIns += 2;

    return true;
}
