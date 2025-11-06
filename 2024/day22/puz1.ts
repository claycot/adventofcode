import fs from "node:fs";
import readline from "node:readline";

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const numsIn: number[] = [];

fileIter.on('line', function (line) {
    numsIn.push(parseInt(line, 10));
});

fileIter.on('close', function (line) {
    let sum = BigInt(0);
    const numsSeen: Record<number, number> = {};
    const numsOut = numsIn.map(num => {
        let sec = num;
        // console.log(`processing secret number ${sec}`);

        for (let i = 0; i < 2000; i++) {
            if (sec < 0) {
                // console.log(`err occurred at ${i}: number became ${sec}`);
                break;
            }
            sec = nextNum(sec, numsSeen);
        }

        // console.log(`${num} becomes ${sec}`);
        sum += BigInt(sec);
        return sec;
    });

    console.log(sum);
});

function mix(val1: number, val2: number): number {
    const Bval1 = BigInt(val1);
    const Bval2 = BigInt(val2);
    // console.log(`mixing ${val1} ^ ${val2} = ${val1 ^ val2}`);
    const Xval = Bval1 ^ Bval2;
    return Number(Xval);
}

function prune(val1: number, val2: number): number {
    // console.log(`pruning ${val1} % ${val2} = ${val1 % val2}`);
    return val1 % val2;
}

function nextNum(val1: number, memo: Record<number, number>): number {
    const inVal: number = val1;
    if (memo.hasOwnProperty(inVal)) {
        return memo[inVal];
    }
    // multiply by 64
    let val2 = val1 * 64;
    // console.log(`val1 ${val1} * 64 = val2 ${val2}`);

    // mix val2 into val1
    val1 = mix(val2, val1);

    // prune val1
    val1 = prune(val1, 16777216);

    // divide by 32
    val2 = Math.floor(val1 / 32);
    // console.log(`val1 ${val1} / 32 = val2 ${val1 / 32} | Math.floor = ${val2}`);
    
    // mix val2 into val1
    val1 = mix(val2, val1);

    // prune val1
    val1 = prune(val1, 16777216);

    // multiply by 2048
    val2 = val1 * 2048;
    // console.log(`val1 ${val1} * 2048 = val2 ${val2}`);

    // mix val2 into val1
    val1 = mix(val2, val1);

    // prune val1
    val1 = prune(val1, 16777216);

    memo[inVal] = val1;
    return val1;
}
