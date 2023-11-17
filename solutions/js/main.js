import { readInput } from "./tools/read.js";
import minimist from "minimist";

let { year, day, part } = minimist(process.argv.slice(2), {
    string: ["year", "day"],
    default: {
        "year": "2020",
        "day": "01",
        "part": null
    }
});

day = day.padStart(2, "0");

try {
    const { part_a, part_b } = await import(`./years/${year.toString()}/${day.toString().padStart(2, "0")}.js`);

    if (part === "a" || part === null && part_a) {
        console.log(part_a(readInput(year, day)));
    }

    if (part === "b" || part === null && part_b) {
        console.log(part_b(readInput(year, day)));
    }
} catch (ex) {
    switch (ex.code) {
        case "ERR_MODULE_NOT_FOUND":
            console.error("Module not found, did you created it?",);
            break;
        case "ENOENT":
            console.error(ex.message);
            break;
        default:
            console.error(ex);
            break;
    }
}