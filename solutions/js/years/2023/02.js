/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.trim().split(/\r?\n/);
    let solution = 0;

    for (let game of list) {
        const gameId = parseInt(game.split(":")[0].replace("Game ", ""));
        const sets = game.split(":")[1].split(";").map(s => s.split(",").map(s => s.trim().split(" ")));

        let possible = false;

        for (let i = 0; i < sets.length; i++) {
            const colors = {
                red: 0,
                green: 0,
                blue: 0,
            }

            const set = sets[i];
            for (let j = 0; j < set.length; j++) {
                const draw = set[j];
                colors[draw[1]] = parseInt(draw[0]);
            }

            if (colors.red > 12 || colors.green > 13 || colors.blue > 14) {
                possible = false;
                break;
            }

            if (colors.red <= 12 && colors.green <= 13 && colors.blue <= 14) {
                possible = true;
            }
        }

        if (possible) {
            solution += gameId;
        }
    }

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    const list = input.trim().split(/\r?\n/);
    let solution = 0;

    for (let game of list) {
        const gameId = parseInt(game.split(":")[0].replace("Game ", ""));
        const sets = game.split(":")[1].split(";").map(s => s.split(",").map(s => s.trim().split(" ")));

        const colors = {
            red: 0,
            green: 0,
            blue: 0,
        }

        for (let i = 0; i < sets.length; i++) {
            const set = sets[i];
            for (let j = 0; j < set.length; j++) {
                const draw = set[j];
                if (colors[draw[1]] < parseInt(draw[0])) {
                    colors[draw[1]] = parseInt(draw[0]);
                }
            }
        }

        solution += (colors.green * colors.blue * colors.red);
    }

    return solution;
}