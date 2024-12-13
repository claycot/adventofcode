const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const input = [];

fileIter.on('line', function (line) {
    if (line.length) {
        input.push(line);
    }
});

fileIter.on('close', function (_) {
    let games = [];

    let i = 0;
    while (i < input.length - 1) {
        let aButton = getButtonCosts(input[i]);
        let bButton = getButtonCosts(input[i + 1]);
        let prize = getPrizeLocation(input[i + 2]);

        games.push({
            a: aButton, b: bButton, prize
        }); 

        i += 3;
    }

    // console.log(games);
    let money = 0;

    games.forEach(game => {
        const b = (game.prize.y * game.a.x - game.prize.x * game.a.y) / (game.a.x * game.b.y - game.a.y * game.b.x);
        const a_1 = (game.prize.x - b * game.b.x) / game.a.x;
        const a_2 = (game.prize.y - b * game.b.y) / game.a.y;

        if (b > 0 && b % 1 === 0 && a_1 > 0 && a_1 % 1 === 0) {
            console.log(`press a ${a_1} times, press b ${b} times`);
            money += 3 * a_1 + b;
        }

    });

    console.log(money);
});

function getButtonCosts(line) {
    return {
        x: line.split(",")[0].split("+")[1],
        y: line.split(",")[1].split("+")[1],
    };
}

function getPrizeLocation(line) {
    return {
        x: line.split(",")[0].split("=")[1],
        y: line.split(",")[1].split("=")[1],
    }
}
